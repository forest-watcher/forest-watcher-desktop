import * as turf from "@turf/turf";
import Icon from "components/extensive/Icon";
import List from "components/extensive/List";
import Button from "components/ui/Button/Button";
import IconBubble from "components/ui/Icon/IconBubble";
import { GeojsonModel } from "generated/core/coreSchemas";
import useFindArea from "hooks/useFindArea";
import { useAppDispatch } from "hooks/useRedux";
import { getGeoFromShape } from "modules/geostores";
import { ChangeEvent, Dispatch, FC, SetStateAction, useRef } from "react";
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
  const selectedAreaDetails = useFindArea(areaId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { getValues, setValue } = useFormContext();
  const dispatch = useAppDispatch();

  const handleShapeFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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

        if (isWithin) {
          setShapeFileGeoJSON(geojsonParsed);
          setShowCreateAssignmentForm(true);
        } else {
          toastr.error(
            intl.formatMessage({ id: "areas.shapeFile.not.within" }),
            intl.formatMessage({ id: "areas.shapeFile.not.within.desc" })
          );
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
  };

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "assignment.create.new" })}
      onBack={() => {
        setValue("selectedAlerts", []);
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
      <div className="rounded-md bg-gray-400 px-4 py-6 flex flex-col items-center">
        <IconBubble className="mb-3" name="flag-white" size={22} />

        <h1 className="text-lg text-gray-700 text-center mb-6">
          <FormattedMessage id="assignments.empty.title" />
        </h1>

        <List<{ text: string }>
          className="flex flex-col text-base text-gray-700 gap-y-4 mb-6"
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
          accept=".kml"
        />
        <Button className="bg-white w-full" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <FormattedMessage id="assignments.empty.upload.shapefile" />
        </Button>
      </div>
    </MapCard>
  );
};

export default OpenAssignmentEmptyState;
