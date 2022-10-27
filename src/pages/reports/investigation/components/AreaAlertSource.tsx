import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { pointStyle } from "components/ui/Map/components/layers/styles";
import { alertTypes, EAlertTypes } from "constants/alerts";
import useGetAlertsForArea from "hooks/querys/alerts/useGetAlertsForArea";
import { FC, useCallback, useMemo, useState } from "react";
import { useMap } from "react-map-gl";
import { IPoint } from "types/map";

export interface IProps {
  areaId?: string;
  alertTypesToShow?: EAlertTypes[];
  alertRequestThreshold?: number;
}

const AreaAssignmentMapSource: FC<IProps> = props => {
  const { areaId, alertTypesToShow, alertRequestThreshold } = props;
  const { current: mapRef } = useMap();
  const alerts = useGetAlertsForArea(areaId, alertTypesToShow, alertRequestThreshold);
  const [, setSelectedAlertIds] = useState<string[] | null>(null);

  const handleAlertSelectionChange = useCallback((ids: string[] | null) => {
    setSelectedAlertIds(ids);
  }, []);

  const alertPoints = useMemo(() => {
    const points: IPoint[] = [];
    for (const alert of alerts) {
      if (alert.isLoading) continue;

      const { type, data } = alert.data;

      for (let i = 0; i < data.length; i++) {
        points.push({
          id: type + i,
          position: [data[i].longitude, data[i].latitude],
          alertTypes: [alertTypes[type]]
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
        mapRef={mapRef?.getMap() || null}
        onSelectionChange={handleAlertSelectionChange}
        canMultiSelect
      />
    </>
  );
};

export default AreaAssignmentMapSource;
