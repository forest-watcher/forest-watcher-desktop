import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { pointStyle } from "components/ui/Map/components/layers/styles";
import { alertTypes } from "constants/alerts";
import useGetAlertsForArea from "hooks/querys/alerts/useGetAlertsForArea";
import { FC, useCallback, useMemo, useState } from "react";
import { useMap } from "react-map-gl";
import { IPoint } from "types/map";

export interface IProps {
  areaId?: string;
}

const AreaAssignmentMapSource: FC<IProps> = props => {
  const { areaId } = props;
  const { current: mapRef } = useMap();
  const { data: alerts } = useGetAlertsForArea(areaId);
  const [, setSelectedPoint] = useState<mapboxgl.Point | null>(null);
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState<string[] | null>(null);

  const handleSquareSelect = useCallback((ids: string[], point: mapboxgl.Point) => {
    setSelectedPoint(point);
    setSelectedAssignmentIds(ids);
  }, []);

  const alertPoints = useMemo(() => {
    const points: IPoint[] = [];
    for (const alertType in alerts) {
      for (let i = 0; i < alerts[alertType].length; i++) {
        points.push({
          id: alertType + i,
          position: [alerts[alertType][i].longitude, alerts[alertType][i].latitude],
          alertTypes: [alertTypes[alertType]]
        });
      }
    }

    return points;
  }, [alerts]);

  return (
    <>
      <SquareClusterMarkers
        id="alerts"
        pointDataType={EPointDataTypes.Alerts}
        points={alertPoints}
        pointStyle={{
          ...pointStyle,
          layout: {
            ...pointStyle.layout,
            "icon-size": ["interpolate", ["exponential", 2], ["zoom"], 14, 0.05, 21, 6.2],
            "icon-pitch-alignment": "auto",
            "icon-rotation-alignment": "map"
          }
        }}
        onSquareSelect={handleSquareSelect}
        selectedSquareIds={selectedAssignmentIds}
        mapRef={mapRef?.getMap() || null}
      />
    </>
  );
};

export default AreaAssignmentMapSource;
