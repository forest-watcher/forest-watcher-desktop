import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import TextArea from "components/ui/Form/Input/TextArea";
import RadioGroup from "components/ui/Form/RadioGroup/RadioGroup";
import MultiSelectDialog from "components/ui/Form/Select/MultiSelectDialog";
import Loader from "components/ui/Loader";
import { TAlertsById } from "components/ui/Map/components/cards/AlertsDetail";
import MapCard from "components/ui/Map/components/cards/MapCard";
import { DEFAULT_TEMPLATE_ID } from "constants/global";
import { usePostV3GfwAssignments } from "generated/core/coreComponents";
import { AssignmentBody } from "generated/core/coreRequestBodies";
import { useAccessToken } from "hooks/useAccessToken";
import useFindArea from "hooks/useFindArea";
import useGetUserId from "hooks/useGetUserId";
import { FC, useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import useGetUserTeamsWithActiveMembers from "hooks/querys/teams/useGetUserTeamsWithActiveMembers";
import { FormattedMessage, useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";
import { useHistory, useLocation, useParams } from "react-router-dom";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

export interface IProps {}

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
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
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

  // Queries - Teams Members
  const { data } = useGetUserTeamsWithActiveMembers();

  // Mutations - Create Assignment
  const { httpAuthHeader } = useAccessToken();
  const { mutateAsync: postAssignment, isLoading } = usePostV3GfwAssignments();

  const handlePostAssignment = async () => {
    const assignmentFormValues = getAssignmentValues();
    const selectedAlerts = getParentValues("selectedAlerts") as TAlertsById[];

    const body: AssignmentBody = {
      // @ts-ignore ToDo: update when endpoint is updated
      location: selectedAlerts.map(alert => ({
        lat: alert.data.latitude,
        lon: alert.data.longitude,
        alertType: alert.data.alertType
      })),
      priority: assignmentFormValues.priority,
      // @ts-ignore
      monitors: [...new Set(assignmentFormValues.monitors)],
      notes: assignmentFormValues.notes,
      areaId: areaId,
      templateIds: assignmentFormValues.templates,
      status: "open" // Default
    };

    // Submit assignment to endpoint
    try {
      await postAssignment({
        body,
        headers: httpAuthHeader
      });

      // Clear selected Alerts
      setParentValue("selectedAlerts", []);

      // ToDo: redirect to Assignment Detail page
      // Redirecting to "Start Investigation" panel for now
      history.push(location.pathname.replace("/assignment", ""));
    } catch (e) {
      toastr.error(intl.formatMessage({ id: "assignment.create.form.error" }), "");
    }
  };

  const teamGroups = useMemo(() => {
    const managedTeamGroups =
      data?.map(team => ({
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
  }, [data, intl, userId]);

  const templateGroups = useMemo(
    () => [
      {
        options:
          selectedAreaDetails?.attributes.reportTemplate
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
                value: template.id
              };
            }) || []
      }
    ],
    [selectedAreaDetails, intl]
  );

  const monitorsWatcher = watch("monitors");

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: `assignment.create.dialog.title.${openDialogName}` })}
      onBack={() => {
        if (openDialogName === EDialogsNames.None) {
          history.push(location.pathname.replace("/assignment", ""));
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
      <Loader isLoading={isLoading} />
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
