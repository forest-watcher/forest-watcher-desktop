import MapCard from "components/ui/Map/components/cards/MapCard";
import { EAlertTypes } from "constants/alerts";
import moment from "moment";
import { FC } from "react";
import { useIntl } from "react-intl";

export interface IProps {
  selectedAlerts?: TAlertsById[];
}

export type TAlertsById = {
  id: string;
  data: Record<any, any>;
};

const ALERT_API_KEY_MAP = {
  date: (alertType: EAlertTypes) => {
    switch (alertType) {
      case EAlertTypes.umd_as_it_happens:
        return "umd_glad_landsat_alerts__date";
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
      case EAlertTypes.wur_radd_alerts:
        return "wur_radd_alerts__confidence";
      default:
        return "";
    }
  }
};

const AlertsDetailCard: FC<IProps> = props => {
  const { selectedAlerts } = props;
  const intl = useIntl();

  if (!selectedAlerts || selectedAlerts?.length === 0) {
    return null;
  }

  const alertsToShow = selectedAlerts.sort(
    (a, b) =>
      Number(moment(a.data[ALERT_API_KEY_MAP.date(a.data.alertType)]).format("X")) -
      Number(moment(b.data[ALERT_API_KEY_MAP.date(b.data.alertType)]).format("X"))
  );

  const alertToShow = selectedAlerts[0];

  const firstAlertDate = moment(alertsToShow[0].data[ALERT_API_KEY_MAP.date(alertsToShow[0].data.alertType)]);
  const lastAlertDate = moment(
    alertsToShow[alertsToShow.length - 1].data[
      ALERT_API_KEY_MAP.date(alertsToShow[alertsToShow.length - 1].data.alertType)
    ]
  );

  const showLastDate = Number(firstAlertDate.format("X")) !== Number(lastAlertDate.format("X"));

  return (
    <MapCard
      className="min-w-[400px]"
      title={intl.formatMessage({ id: "alerts.deforestation.alerts" })}
      titleIconName="Deforestation"
      position="bottom-right"
    >
      <div className="text-gray-700 text-base">
        <p className="mt-1">
          {intl.formatMessage({ id: "alerts.detail.issued" })}: {firstAlertDate.format("MMM DD, YYYY")}
          {showLastDate ? " - " + lastAlertDate.format("MMM DD, YYYY") : ""}
        </p>
        <p className="mt-1">
          {intl.formatMessage({ id: "alerts.detail.alertType" })}:{" "}
          {intl.formatMessage({ id: `alerts.${alertToShow.data.alertType}` })}
        </p>

        {alertToShow.data[ALERT_API_KEY_MAP.confidence(alertToShow.data.alertType)] === "high" && (
          <p className="mt-1">
            {intl.formatMessage({ id: "alerts.detail.confidenceLevel" })}:{" "}
            {intl.formatMessage({ id: "alerts.detail.confidenceLevel.high" })}
          </p>
        )}
      </div>
    </MapCard>
  );
};

export default AlertsDetailCard;
