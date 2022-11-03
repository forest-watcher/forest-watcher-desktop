import Polygon from "components/ui/Map/components/layers/Polygon";
import useZoomToGeojson from "hooks/useZoomToArea";
import { GeoJSONSourceOptions } from "mapbox-gl";
import CreateAssignmentForm from "pages/reports/investigation/control-panels/CreateAssignment/states/CreateAssignmentForm";
import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import OpenAssignmentEmptyState from "pages/reports/investigation/control-panels/CreateAssignment/states/EmptyState";

export interface IProps {}

const CreateAssignmentControlPanel: FC<IProps> = props => {
  const { getValues } = useFormContext();
  const [showCreateAssignmentForm, setShowCreateAssignmentForm] = useState(false);
  const [shapeFileGeoJSON, setShapeFileGeoJSON] = useState<GeoJSONSourceOptions["data"]>();

  // @ts-ignore
  useZoomToGeojson(shapeFileGeoJSON);

  useEffect(() => {
    if (getValues("selectedAlerts") && getValues("selectedAlerts").length) {
      // Skip the Empty state on initial render, if alerts have already been selected
      setShowCreateAssignmentForm(true);
    }
  }, [getValues]);

  return (
    <>
      {!showCreateAssignmentForm ? (
        <OpenAssignmentEmptyState
          setShowCreateAssignmentForm={setShowCreateAssignmentForm}
          setShapeFileGeoJSON={setShapeFileGeoJSON}
        />
      ) : (
        <CreateAssignmentForm />
      )}

      {shapeFileGeoJSON && (
        <Polygon key="assignment-shape-file" id="assignment-shape-file" label="" data={shapeFileGeoJSON} />
      )}
    </>
  );
};

export default CreateAssignmentControlPanel;
