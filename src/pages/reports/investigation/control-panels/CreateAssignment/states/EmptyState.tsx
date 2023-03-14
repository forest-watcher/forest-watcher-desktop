import * as turf from "@turf/turf";
import Icon from "components/extensive/Icon";
import List from "components/extensive/List";
import Button from "components/ui/Button/Button";
import IconBubble from "components/ui/Icon/IconBubble";
import Loader from "components/ui/Loader";
import { GeojsonModel } from "generated/core/coreSchemas";
import { fireGAEvent } from "helpers/analytics";
import useFindArea from "hooks/useFindArea";
import { useAppDispatch } from "hooks/useRedux";
import { getGeoFromShape } from "modules/geostores";
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";
import { useHistory, useLocation, useParams } from "react-router-dom";
import MapCard from "components/ui/Map/components/cards/MapCard";

export interface IProps {
  setShowCreateAssignmentForm: Dispatch<SetStateAction<boolean>>;
  setShapeFileGeoJSON: Dispatch<SetStateAction<GeojsonModel | undefined>>;
}

const OpenAssignmentEmptyState: FC<IProps> = props => {
  const { setShowCreateAssignmentForm, setShapeFileGeoJSON } = props;
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { areaId } = useParams<{ areaId: string }>();
  const { area: selectedAreaDetails } = useFindArea(areaId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { getValues, setValue, watch } = useFormContext();
  const [isUploadingShapeFile, setIsUploadingShapeFile] = useState(false);
  const dispatch = useAppDispatch();

  const selectedAlertsWatch = watch("selectedAlerts");

  useEffect(() => {
    if (selectedAlertsWatch.length) {
      fireGAEvent({
        category: "Assignment",
        action: "create_assigment",
        label: "selected_alert"
      });
    }
  }, [selectedAlertsWatch]);

  const handleShapeFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsUploadingShapeFile(true);
    const shapeFile = e.target.files && e.target.files[0];
    const maxFileSize = 1000000; //1MB

    if (shapeFile && shapeFile.size <= maxFileSize) {
      const geojson = (await dispatch(getGeoFromShape(shapeFile))) as any;

      if (geojson && geojson.features && selectedAreaDetails) {
        // https://turfjs.org/docs/#union
        const geojsonParsed = geojson.features.reduce(turf.union);
        // @ts-ignore
        const selectedAreaParsed = selectedAreaDetails?.attributes?.geostore?.geojson.features.reduce(turf.union);

        // @ts-ignore
        const isWithin = turf.booleanWithin(geojsonParsed, selectedAreaParsed);

        const isAPolygon = turf.getType(geojsonParsed) === "Polygon";

        if (isWithin && isAPolygon) {
          setShapeFileGeoJSON(geojsonParsed);
          setValue("selectedAlerts", []);
          setValue("singleSelectedLocation", undefined);
          setShowCreateAssignmentForm(true);

          fireGAEvent({
            category: "Assignment",
            action: "create_assigment",
            label: "uploaded_shapefile"
          });
        } else if (!isWithin) {
          toastr.error(
            intl.formatMessage({ id: "areas.shapeFile.not.within" }),
            intl.formatMessage({ id: "areas.shapeFile.not.within.desc" })
          );
        } else if (!isAPolygon) {
          toastr.error(intl.formatMessage({ id: "areas.shapeFile.not.shapefile" }), "");
        }
      } else {
        toastr.error(intl.formatMessage({ id: "areas.fileInvalid" }), "");
      }
    } else {
      toastr.error(
        intl.formatMessage({ id: "areas.fileTooLarge" }),
        intl.formatMessage({ id: "areas.fileTooLargeDesc" })
      );
    }

    setIsUploadingShapeFile(false);
  };

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "assignment.create.new" })}
      onBack={() => {
        setValue("singleSelectedLocation", undefined);
        history.push(location.pathname.replace("/assignment", ""));
      }}
      footer={
        <Button
          disabled={
            !(getValues("selectedAlerts") && getValues("selectedAlerts").length) && !getValues("singleSelectedLocation")
          }
          onClick={() => setShowCreateAssignmentForm(true)}
        >
          <FormattedMessage id="assignment.create" />
        </Button>
      }
    >
      <Loader isLoading={isUploadingShapeFile} />
      <div className="rounded-md bg-neutral-400 px-4 py-6 flex flex-col items-center">
        <IconBubble className="mb-3" name="flag-white" size={22} />

        <h1 className="text-lg text-neutral-700 text-center mb-6">
          <FormattedMessage id="assignments.empty.title" />
        </h1>

        <List<{ text: string }>
          className="flex flex-col text-base text-neutral-700 gap-y-4 mb-6"
          items={[
            { text: intl.formatMessage({ id: "assignments.empty.content.list.item.1" }) },
            { text: intl.formatMessage({ id: "assignments.empty.content.list.item.2" }) },
            { text: intl.formatMessage({ id: "assignments.empty.content.list.item.3" }) }
          ]}
          render={i => (
            <div>
              <Icon className="inline align-middle mr-3" size={12} name="oval" />
              {i.text}
            </div>
          )}
        />

        <input
          ref={fileInputRef}
          onChange={handleShapeFileUpload}
          id="shapefile-input"
          type="file"
          className="hidden"
          accept=".zip, .csv, .json, .geojson, .kml, .kmz"
        />
        <Button className="bg-neutral-300 w-full" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <FormattedMessage id="assignments.empty.upload.shapefile" />
        </Button>
      </div>
    </MapCard>
  );
};

export default OpenAssignmentEmptyState;
