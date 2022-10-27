import OptionalWrapper from "components/extensive/OptionalWrapper";
import AlertsDetailCard from "components/ui/Map/components/cards/AlertsDetail";
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

type TAlertsById = {
  id: string;
  data: Record<any, any>;
};

const AreaAssignmentMapSource: FC<IProps> = props => {
  const { areaId, alertTypesToShow, alertRequestThreshold } = props;
  const { current: mapRef } = useMap();
  const alerts = useGetAlertsForArea(areaId, alertTypesToShow, alertRequestThreshold);
  const [selectedAlerts, setSelectedAlerts] = useState<TAlertsById[]>();

  const [alertPoints, alertsById] = useMemo(
    () => {
      const copyAlerts = [...alerts];

      const pointData: IPoint[] = [];
      const pointsById: TAlertsById[] = [];
      for (const alert of copyAlerts) {
        if (alert.isLoading) continue;

        const { type, data } = alert.data;

        for (let i = 0; i < data.length; i++) {
          const alertId = (type + i) as string;

          pointData.push({
            id: alertId,
            position: [data[i].longitude, data[i].latitude],
            alertTypes: [alertTypes[type]]
          });

          pointsById.push({
            id: alertId,
            data: { ...data[i], alertType: type }
          });
        }
      }

      console.log("point recalc");

      return [pointData, pointsById];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    alerts.map(queryAlert => queryAlert.data) // ToDo: update when using fw_alerts endpoint
  );

  const handleAlertSelectionChange = useCallback(
    (ids: string[] | null) => {
      setSelectedAlerts([...alertsById].filter(alert => ids?.includes(alert.id)));
    },
    [alertsById]
  );

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

      <OptionalWrapper data={(selectedAlerts?.length && selectedAlerts.length > 0) || false}>
        <AlertsDetailCard selectedAlerts={alerts} />
      </OptionalWrapper>
    </>
  );
};

export default AreaAssignmentMapSource;
