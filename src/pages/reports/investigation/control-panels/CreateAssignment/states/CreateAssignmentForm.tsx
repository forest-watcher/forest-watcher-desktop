import { useQueryClient } from "@tanstack/react-query";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import TextArea from "components/ui/Form/Input/TextArea";
import RadioGroup from "components/ui/Form/RadioGroup/RadioGroup";
import MultiSelectDialog from "components/ui/Form/Select/MultiSelectDialog";
import Loader from "components/ui/Loader";
import { TAlertsById } from "types/map";
import MapCard from "components/ui/Map/components/cards/MapCard";
import { DEFAULT_TEMPLATE_ID } from "constants/global";
import { useGetV3GfwTemplates, usePostV3GfwAssignments } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
import { AssignmentBody } from "generated/core/coreRequestBodies";
import { GeojsonModel } from "generated/core/coreSchemas";
import { useAccessToken } from "hooks/useAccessToken";
import useFindArea from "hooks/useFindArea";
import useGetUserId from "hooks/useGetUserId";
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import useGetUserTeamsWithActiveMembers from "hooks/querys/teams/useGetUserTeamsWithActiveMembers";
import { FormattedMessage, useIntl } from "react-intl";
import { LngLat, LngLatBoundsLike, useMap } from "react-map-gl";
import { toastr } from "react-redux-toastr";
import { useHistory, useParams } from "react-router-dom";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { serialize } from "object-to-formdata";
import { goToGeojson } from "helpers/map";
import * as turf from "@turf/turf";
export interface IProps {
  setShowCreateAssignmentForm: Dispatch<SetStateAction<boolean>>;
  setShapeFileGeoJSON: Dispatch<SetStateAction<GeojsonModel | undefined>>;
  shapeFileGeoJSON?: GeojsonModel;
}

type TCreateAssignmentFormFields = {
  priority: number;
  monitors: string[];
  templates: string[];
  notes: string;
};

enum EDialogsNames {
  None = "none",
  Monitors = "monitors",
  Templates = "templates"
}

const createAssignmentFormSchema = yup
  .object()
  .shape({
    priority: yup.number().min(0).max(1).integer().required(),
    monitors: yup.array().of(yup.string()).min(1).required(),
    templates: yup.array().of(yup.string()).min(1).required(),
    notes: yup.string()
  })
  .required();

const CreateAssignmentForm: FC<IProps> = props => {
  const { setShowCreateAssignmentForm, setShapeFileGeoJSON, shapeFileGeoJSON } = props;
  const intl = useIntl();
  const history = useHistory();
  const { current: map } = useMap();
  const userId = useGetUserId();
  const { areaId } = useParams<{ areaId: string }>();
  const selectedAreaDetails = useFindArea(areaId);
  const [openDialogName, setOpenDialogName] = useState<EDialogsNames>(EDialogsNames.None);

  // FormData
  const { getValues: getParentValues, setValue: setParentValue } = useFormContext();
  const {
    control,
    watch,
    setValue,
    getValues: getAssignmentValues,
    handleSubmit,
    formState
  } = useForm<TCreateAssignmentFormFields>({
    mode: "onChange",
    defaultValues: {
      priority: 0,
      monitors: [],
      templates: DEFAULT_TEMPLATE_ID ? [DEFAULT_TEMPLATE_ID] : [],
      notes: ""
    },
    resolver: yupResolver(createAssignmentFormSchema)
  });

  useEffect(() => {
    if (userId) {
      setValue("monitors", [userId]);
    }
  }, [setValue, userId]);

  const { httpAuthHeader } = useAccessToken();
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();
  // Queries - Teams Members
  const { data: teamData, isLoading: isTeamDataLoading } = useGetUserTeamsWithActiveMembers();
  // Queries - User Templates
  const { data: templateData, isLoading: isTemplateDataLoading } = useGetV3GfwTemplates({
    headers: httpAuthHeader
  });

  // Mutations - Create Assignment
  const { mutateAsync: postAssignment, isLoading: isSubmitting } = usePostV3GfwAssignments({
    onSuccess: () => {
      queryClient.invalidateQueries(
        queryKeyFn({
          path: "/v3/gfw/assignments/allOpenUserForArea/{areaId}",
          operationId: "getV3GfwAssignmentsAllOpenUserForAreaAreaId",
          variables: {
            pathParams: {
              areaId: areaId!
            },
            headers: httpAuthHeader
          }
        })
      );
    }
  });

  const handlePostAssignment = async () => {
    const assignmentFormValues = getAssignmentValues();
    const selectedAlerts = getParentValues("selectedAlerts") as TAlertsById[];
    const singleSelectedLocation = getParentValues("singleSelectedLocation") as LngLat;
    const body: AssignmentBody = {
      priority: assignmentFormValues.priority,
      // @ts-ignore
      monitors: [...new Set(assignmentFormValues.monitors)],
      notes: assignmentFormValues.notes,
      areaId: areaId,
      // @ts-ignore issue with openapi spec, remove ignore when fixed
      status: "open", // Default
      templateIds: assignmentFormValues.templates
    };

    if (shapeFileGeoJSON) {
      // Assign the custom shape file to the Assignment
      body.geostore = shapeFileGeoJSON;
      if (map) {
        goToGeojson(map, shapeFileGeoJSON, false);
      }
    } else if (singleSelectedLocation) {
      // Else use the Single Selected Location
      body.location = [
        {
          lat: singleSelectedLocation.lat,
          lon: singleSelectedLocation.lng
        }
      ];
      if (map) {
        map.flyTo({ center: [singleSelectedLocation.lng, singleSelectedLocation.lat], animate: false });
      }
      // go to point on the map
    } else if (selectedAlerts) {
      // Else use the selected Alerts on Map
      body.location = selectedAlerts.map(alert => ({
        lat: alert.data.latitude,
        lon: alert.data.longitude,
        alertType: alert.data.alertType
      }));

      const points = turf.points(selectedAlerts.map(alert => [alert.data.longitude, alert.data.latitude]));
      const bbox = turf.bbox(points);

      if (map && bbox.length > 0) {
        map.fitBounds(bbox as LngLatBoundsLike, { padding: 40, animate: false });
      }
    }

    if (map) {
      const node = map?.getCanvas();
      const dataUrl = node.toDataURL("image/jpeg");
      const blob = await (await fetch(dataUrl)).blob();
      const imageFile = new File([blob], `${encodeURIComponent("assignment")}.jpg`, { type: "image/jpeg" });
      body.image = imageFile;
    }

    const formData = serialize(body, { indices: true });

    // Submit assignment to endpoint
    try {
      const resp = await postAssignment({
        // @ts-ignore postAssignment doesn't accept form data but the fetcher library handles it
        body: formData,
        headers: { ...httpAuthHeader, "Content-Type": "multipart/form-data" }
      });

      setParentValue("selectedAlerts", []);
      setParentValue("singleSelectedLocation", undefined);
      history.push(`/assignment/${resp.data?.id}`);
    } catch (e) {
      toastr.error(intl.formatMessage({ id: "assignment.create.form.error" }), "");
    }
  };

  const teamGroups = useMemo(() => {
    const managedTeamGroups =
      teamData?.map(team => ({
        label: team?.attributes?.name || "",
        options:
          team?.attributes?.members?.map(member => ({
            label: member.name || member.email,
            value: member.userId!
          })) || []
      })) || [];

    return [
      {
        label: intl.formatMessage({ id: "assignment.create.dialog.monitors.default.label" }),
        options: [
          {
            value: `${userId}`,
            label: intl.formatMessage({ id: "assignment.create.dialog.monitors.default.self.label" })
          }
        ]
      },
      ...managedTeamGroups
    ];
  }, [teamData, intl, userId]);

  const templateGroups = useMemo(() => {
    // Wait for user templates to be fetched
    if (isTemplateDataLoading) {
      return [];
    }

    const areaTemplates = selectedAreaDetails?.attributes.reportTemplate || [];

    const nonDuplicateUserTemplates =
      templateData?.data
        ?.filter(
          userTemplate =>
            // Templates not already included on the Area, and templates created by the Auth User
            areaTemplates.findIndex(r => r.id === userTemplate.id) === -1 && userTemplate.attributes?.user === userId
        )
        // Refactor object so it matches areaTemplates
        .map(t => ({ id: t.id, ...t.attributes })) || [];

    return [
      {
        options: [...areaTemplates, ...nonDuplicateUserTemplates]
          // Default template should be first in the list!
          .sort(a => (a.id === DEFAULT_TEMPLATE_ID ? -1 : 0))
          .map(template => {
            if (template.id === DEFAULT_TEMPLATE_ID) {
              // For the default template, change translation its label
              return {
                label: intl.formatMessage({ id: "assignment.create.form.template.default.label" }),
                value: template.id
              };
            }

            return {
              // @ts-ignore
              label: template.name[template.defaultLanguage],
              value: template.id!
            };
          })
      }
    ];
  }, [templateData, isTemplateDataLoading, selectedAreaDetails, intl, userId]);

  const monitorsWatcher = watch("monitors");

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: `assignment.create.dialog.title.${openDialogName}` })}
      onBack={() => {
        if (openDialogName === EDialogsNames.None) {
          setShapeFileGeoJSON(undefined);
          setShowCreateAssignmentForm(false);
        } else {
          setOpenDialogName(EDialogsNames.None);
        }
      }}
      footer={
        openDialogName === EDialogsNames.None ? (
          <Button disabled={!formState.isValid} onClick={handleSubmit(handlePostAssignment)}>
            <FormattedMessage id="assignment.create" />
          </Button>
        ) : null
      }
    >
      <Loader isLoading={isSubmitting || isTemplateDataLoading || isTeamDataLoading} />
      <OptionalWrapper data={openDialogName === EDialogsNames.None}>
        <RadioGroup<TCreateAssignmentFormFields>
          control={control}
          name="priority"
          label="assignment.create.form.priority.label"
          options={[
            { key: "normal", label: "assignment.create.form.priority.normal", value: 0 },
            { key: "high", label: "assignment.create.form.priority.high", value: 1 }
          ]}
        />

        <MultiSelectDialog.Preview
          className="mt-10"
          groups={teamGroups}
          control={control}
          name="monitors"
          error={formState.errors.monitors}
          label="assignment.create.form.monitor.label"
          emptyLabel="assignment.create.form.monitor.empty"
          emptyIcon="white-foot"
          addButtonLabel="assignment.create.form.monitor.add"
          onAdd={() => setOpenDialogName(EDialogsNames.Monitors)}
        />

        <OptionalWrapper data={monitorsWatcher.length > 0}>
          <TextArea
            wrapperClassName="mt-6"
            id="monitor-notes"
            label="assignment.create.form.notesForMonitors"
            altLabel
            control={control}
            name="notes"
          />
        </OptionalWrapper>

        <MultiSelectDialog.Preview
          className="mt-10"
          groups={templateGroups}
          shouldDisplayGroupOptionsOnSeparateLines
          control={control}
          name="templates"
          error={formState.errors.templates}
          label="assignment.create.form.template.label"
          emptyLabel="assignment.create.form.template.empty"
          emptyIcon="FactCheck"
          addButtonLabel="assignment.create.form.template.add"
          onAdd={() => setOpenDialogName(EDialogsNames.Templates)}
          shouldDisplayAllLabel={false}
        />
      </OptionalWrapper>

      <OptionalWrapper data={openDialogName === EDialogsNames.Monitors}>
        <MultiSelectDialog groups={teamGroups} control={control} name="monitors" />
      </OptionalWrapper>

      <OptionalWrapper data={openDialogName === EDialogsNames.Templates}>
        <MultiSelectDialog groups={templateGroups} control={control} name="templates" />
      </OptionalWrapper>
    </MapCard>
  );
};

export default CreateAssignmentForm;
