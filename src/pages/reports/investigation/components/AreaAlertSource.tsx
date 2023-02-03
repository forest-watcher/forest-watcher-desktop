import AlertsDetailCard from "components/ui/Map/components/cards/AlertsDetail";
import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { pointStyle } from "components/ui/Map/components/layers/styles";
import { EAlertTypes } from "constants/alerts";
import { findNeighboringPoints } from "helpers/map";
import useGetAlertsForArea from "hooks/querys/alerts/useGetAlertsForArea";
import { FC, useCallback, useContext, useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useMap } from "react-map-gl";
import KDBush from "kdbush";
import { IPoint, TAlertsById } from "types/map";
import AlertSelectionCard from "components/ui/Map/components/cards/AlertSelection";
import MapContext from "../MapContext";

export interface IProps {
  areaId?: string;
  alertTypesToShow?: EAlertTypes[];
  alertRequestThreshold?: number;
  locked?: boolean;
}

const AreaAlertMapSource: FC<IProps> = props => {
  const { areaId, alertTypesToShow, alertRequestThreshold, locked = false } = props;
  const { current: mapRef } = useMap();
  const { setValue, control } = useFormContext();
  const selectedAlerts = useWatch({ control, name: "selectedAlerts" });

  const {
    active: { selectedAlertIds, neighboringAlertIds, multipleAlertsToPick },
    setSelectedAlertIds,
    setNeighboringAlertIds,
    setMultipleAlertsToPick
  } = useContext(MapContext);

  const alerts = useGetAlertsForArea(areaId, alertTypesToShow, alertRequestThreshold);

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
            type: type
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

  const handleAlertSelectionChange = useCallback(
    (ids: string[] | null) => {
      setValue(
        "selectedAlerts",
        alertsById.filter(alert => ids?.includes(alert.id))
      );
      setSelectedAlertIds?.(ids);
      setMultipleAlertsToPick?.(null);
    },
    [alertsById, setMultipleAlertsToPick, setSelectedAlertIds, setValue]
  );

  const handleSelectedPointsConfirm = (ids: string[]) => {
    const newIds = [...(selectedAlertIds || []), ...ids];
    handleAlertSelectionChange(newIds);
  };

  const handleSelectNeighboringPoints = () => {
    if (!neighboringAlertIds || !selectedAlertIds) return;

    handleAlertSelectionChange([...selectedAlertIds, ...neighboringAlertIds]);
  };

  useEffect(() => {
    // If all selected Alerts for parent form are removed
    // Set SelectedAlertIds to null so that the SquareClusterMarkers are cleared too
    if (selectedAlerts && selectedAlerts.length === 0) {
      setSelectedAlertIds?.(null);
    }

    if (selectedAlerts && selectedAlerts?.length > 0) {
      setNeighboringAlertIds?.(findNeighboringPoints(pointsIndex, selectedAlerts).map(point => point.id));
    }
  }, [pointsIndex, selectedAlerts, setSelectedAlertIds, setNeighboringAlertIds]);

  return (
    <>
      <SquareClusterMarkers
        id="alerts"
        pointDataType={EPointDataTypes.Alerts}
        points={alertPoints}
        selectedSquareIds={selectedAlertIds}
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
        onSelectionOverlapped={ids => setMultipleAlertsToPick?.(ids)}
        canMultiSelect
        canMapDeselect
        locked={locked}
      />

      {multipleAlertsToPick ? (
        <AlertSelectionCard
          selectedAlerts={multipleAlertsToPick}
          handleSelectedPointsConfirm={handleSelectedPointsConfirm}
          alertsById={alertsById}
        />
      ) : (
        <AlertsDetailCard
          selectedAlerts={selectedAlerts}
          handleSelectNeighboringPoints={handleSelectNeighboringPoints}
          canSelectNeighboringAlert={neighboringAlertIds?.length! > 0}
        />
      )}
    </>
  );
};

export default AreaAlertMapSource;
