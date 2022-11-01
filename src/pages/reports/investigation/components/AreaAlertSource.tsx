import AlertsDetailCard from "components/ui/Map/components/cards/AlertsDetail";
import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { pointStyle } from "components/ui/Map/components/layers/styles";
import { alertTypes, EAlertTypes } from "constants/alerts";
import { findNeighboringPoints } from "helpers/map";
import useGetAlertsForArea from "hooks/querys/alerts/useGetAlertsForArea";
import { FC, useCallback, useMemo, useState } from "react";
import { useMap } from "react-map-gl";
import KDBush from "kdbush";
import { IPoint, TAlertsById } from "types/map";

export interface IProps {
  areaId?: string;
  alertTypesToShow?: EAlertTypes[];
  alertRequestThreshold?: number;
}

const AreaAssignmentMapSource: FC<IProps> = props => {
  const { areaId, alertTypesToShow, alertRequestThreshold } = props;
  const { current: mapRef } = useMap();
  const alerts = useGetAlertsForArea(areaId, alertTypesToShow, alertRequestThreshold);
  const [selectedAlerts, setSelectedAlerts] = useState<TAlertsById[]>();

  const [alertPoints, alertsById, pointsIndex] = useMemo(
    () => {
      const copyAlerts = [...alerts];

      const pointData: IPoint[] = [];
      const pointsById: TAlertsById[] = [];
      for (const alert of copyAlerts) {
        if (alert.isLoading || !alert.data) continue;

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

      const pointsIndex = new KDBush(
        pointsById,
        p => p.data.longitude,
        p => p.data.latitude
      );

      return [pointData, pointsById, pointsIndex];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    alerts.map(queryAlert => queryAlert.data) // ToDo: update when using fw_alerts endpoint
  );

  const handleSelectNeighboringPoints = () => {
    if (selectedAlerts && selectedAlerts?.length > 0) {
      findNeighboringPoints(pointsIndex, selectedAlerts);
    }
  };

  const handleAlertSelectionChange = useCallback(
    (ids: string[] | null) => {
      setSelectedAlerts(alertsById.filter(alert => ids?.includes(alert.id)));
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
        canMapDeselect
      />

      <AlertsDetailCard selectedAlerts={selectedAlerts} />
    </>
  );
};

export default AreaAssignmentMapSource;
