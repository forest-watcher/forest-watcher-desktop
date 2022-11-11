import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import MapCard from "components/ui/Map/components/cards/MapCard";
import { EAlertTypes } from "constants/alerts";
import moment from "moment";
import { FC } from "react";
import { useIntl } from "react-intl";
import { TAlertsById } from "types/map";

export interface IProps {
  selectedAlerts?: TAlertsById[];
  handleSelectNeighboringPoints?: () => void;
  canSelectNeighboringAlert?: boolean;
}

const ALERT_API_KEY_MAP = {
  date: (alertType: EAlertTypes) => {
    switch (alertType) {
      case EAlertTypes.umd_as_it_happens:
        return "umd_glad_landsat_alerts__date";
      case EAlertTypes.glad_sentinel_2:
        return "umd_glad_sentinel2_alerts__date";
      case EAlertTypes.wur_radd_alerts:
        return "wur_radd_alerts__date";
      default:
        return "";
    }
  },
  confidence: (alertType: EAlertTypes) => {
    switch (alertType) {
      case EAlertTypes.umd_as_it_happens:
        return "umd_glad_landsat_alerts__confidence";
      case EAlertTypes.glad_sentinel_2:
        return "umd_glad_sentinel2_alerts__confidence";
      case EAlertTypes.wur_radd_alerts:
        return "wur_radd_alerts__confidence";
      default:
        return "";
    }
  }
};

const AlertsDetailCard: FC<IProps> = props => {
  const { selectedAlerts, handleSelectNeighboringPoints, canSelectNeighboringAlert = false } = props;
  const intl = useIntl();

  if (!selectedAlerts || selectedAlerts?.length === 0) {
    return null;
  }

  const alertsToShow = selectedAlerts.sort(
    (a, b) =>
      Number(moment(a.data[ALERT_API_KEY_MAP.date(a.data.alertType)]).format("X")) -
      Number(moment(b.data[ALERT_API_KEY_MAP.date(b.data.alertType)]).format("X"))
  );

  const firstAlertDate = moment(alertsToShow[0].data[ALERT_API_KEY_MAP.date(alertsToShow[0].data.alertType)]);
  const lastAlertDate = moment(
    alertsToShow[alertsToShow.length - 1].data[
      ALERT_API_KEY_MAP.date(alertsToShow[alertsToShow.length - 1].data.alertType)
    ]
  );

  const showLastDate = Number(firstAlertDate.format("X")) !== Number(lastAlertDate.format("X"));
  // @ts-ignore
  const allAlertTypes = [...new Set(alertsToShow.map(alert => alert.data.alertType))];
  const numOfHighConfidenceAlerts = alertsToShow.filter(
    alert => alert.data[ALERT_API_KEY_MAP.confidence(alert.data.alertType)] === "high"
  ).length;

  return (
    <MapCard
      className="min-w-[400px]"
      title={intl.formatMessage({ id: "alerts.deforestation.alerts" })}
      titleIconName="Deforestation"
      position="bottom-right"
      footer={
        canSelectNeighboringAlert ? (
          <Button variant="secondary" onClick={handleSelectNeighboringPoints}>
            Select All Connected Alerts
          </Button>
        ) : null
      }
    >
      <div className="text-gray-700 text-base">
        <p className="mt-1">
          {intl.formatMessage({ id: "alerts.detail.issued" })}: {firstAlertDate.format("MMM DD, YYYY")}
          {showLastDate && " - " + lastAlertDate.format("MMM DD, YYYY")}
        </p>
        <p className="mt-1">
          {intl.formatMessage({ id: "alerts.detail.alertType" })}:{" "}
          {allAlertTypes.map(alertType => intl.formatMessage({ id: `alerts.${alertType}` })).join(", ")}
        </p>

        {numOfHighConfidenceAlerts > 0 && (
          <p className="mt-1">
            {intl.formatMessage({ id: "alerts.detail.confidenceLevel" })}:{" "}
            {intl.formatMessage({
              id: `alerts.detail.confidenceLevel.${
                numOfHighConfidenceAlerts === alertsToShow.length ? "high" : "high.multiple"
              }`
            })}
          </p>
        )}
      </div>

      <OptionalWrapper data={!canSelectNeighboringAlert}>
        <div className="text-gray-700 text-base p-4 bg-gray-400 rounded-md mt-6">
          <Icon className="align-middle mr-2" name="InfoBubble" size={20} />
          <span>{intl.formatMessage({ id: "alerts.detail.select.neighboring.alerts" })}</span>
        </div>
      </OptionalWrapper>
    </MapCard>
  );
};

export default AlertsDetailCard;
