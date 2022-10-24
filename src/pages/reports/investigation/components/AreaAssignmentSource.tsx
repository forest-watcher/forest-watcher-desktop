import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { FC, useCallback, useState } from "react";
import { useMap } from "react-map-gl";

export interface IProps {}

const AreaAssignmentMapSource: FC<IProps> = props => {
  const { current: mapRef } = useMap();
  const [, setSelectedPoint] = useState<mapboxgl.Point | null>(null);
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState<string[] | null>(null);

  const handleSquareSelect = useCallback((ids: string[], point: mapboxgl.Point) => {
    setSelectedPoint(point);
    setSelectedAssignmentIds(ids);
  }, []);

  return (
    <>
      <SquareClusterMarkers
        id="assignments"
        pointDataType={EPointDataTypes.Alerts}
        // ToDo: Fetch assignment points from API
        points={[{ position: [47.30005, -19.33615], id: "0" }]}
        onSquareSelect={handleSquareSelect}
        selectedSquareIds={selectedAssignmentIds}
        mapRef={mapRef?.getMap() || null}
      />
    </>
  );
};

export default AreaAssignmentMapSource;
