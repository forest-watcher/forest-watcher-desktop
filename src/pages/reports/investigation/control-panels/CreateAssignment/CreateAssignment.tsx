import SingleLocationLayer from "components/ui/Map/components/layers/Location";
import Polygon from "components/ui/Map/components/layers/Polygon";
import { GeojsonModel } from "generated/core/coreSchemas";
import useZoomToGeojson from "hooks/useZoomToArea";
import CreateAssignmentForm from "pages/reports/investigation/control-panels/CreateAssignment/states/CreateAssignmentForm";
import { FC, useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import OpenAssignmentEmptyState from "pages/reports/investigation/control-panels/CreateAssignment/states/EmptyState";
import { LngLat } from "react-map-gl";
import { useParams } from "react-router-dom";

export interface IProps {}

const CreateAssignmentControlPanel: FC<IProps> = props => {
  const { getValues, setValue } = useFormContext();
  const { areaId } = useParams<{ areaId: string }>();
  const [showCreateAssignmentForm, setShowCreateAssignmentForm] = useState(false);
  const [shapeFileGeoJSON, setShapeFileGeoJSON] = useState<GeojsonModel>();

  // @ts-ignore
  useZoomToGeojson(shapeFileGeoJSON);

  useEffect(() => {
    // Skip the Empty state on initial render, if alerts have already been selected
    if (getValues("selectedAlerts") && getValues("selectedAlerts").length) {
      setShowCreateAssignmentForm(true);
    }
  }, [getValues]);

  const handleSingleLocationSelect = useCallback(
    (location?: LngLat) => setValue("singleSelectedLocation", location),
    [setValue]
  );

  return (
    <>
      {!showCreateAssignmentForm ? (
        <OpenAssignmentEmptyState
          setShowCreateAssignmentForm={setShowCreateAssignmentForm}
          setShapeFileGeoJSON={setShapeFileGeoJSON}
        />
      ) : (
        <CreateAssignmentForm shapeFileGeoJSON={shapeFileGeoJSON} />
      )}

      {/* User is able to add a shapefile */}
      {shapeFileGeoJSON && (
        // @ts-ignore
        <Polygon key="assignment-shape-file" id="assignment-shape-file" label="" data={shapeFileGeoJSON} />
      )}

      {/* User is able to select a single location */}
      <SingleLocationLayer
        id="create-assignment-single-location"
        withinLayerId={areaId}
        onSelectedLocationChange={handleSingleLocationSelect}
      />
    </>
  );
};

export default CreateAssignmentControlPanel;
