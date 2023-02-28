import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import MapCard from "components/ui/Map/components/cards/MapCard";
import { sortAlertsOldestFirst, sortAlertsNewestFirst } from "helpers/alerts";
import { useAppSelector } from "hooks/useRedux";
import moment from "moment";
import { FC } from "react";
import ReactDOM from "react-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { TAlertsById } from "types/map";

export interface IProps {
  selectedAlerts?: TAlertsById[];
  handleSelectNeighboringPoints?: () => void;
  canSelectNeighboringAlert?: boolean;
}

const AlertsDetailCard: FC<IProps> = props => {
  const { selectedAlerts, handleSelectNeighboringPoints, canSelectNeighboringAlert = false } = props;
  const portal = useAppSelector(state => state.layers.portal);
  const intl = useIntl();

  if (!selectedAlerts || selectedAlerts?.length === 0) {
    return null;
  }

  const alertsToShow = sortAlertsOldestFirst(selectedAlerts.map(i => i.data));

  const firstAlertDate = moment(alertsToShow[0].date);
  const lastAlertDate = moment(alertsToShow[alertsToShow.length - 1].date);

  const showLastDate = Number(firstAlertDate.format("X")) !== Number(lastAlertDate.format("X"));
  // @ts-ignore
  const allAlertTypes = [...new Set(alertsToShow.map(alert => alert.alertType))];
  const numOfHighConfidenceAlerts = alertsToShow.filter(alert => alert.confidence === "high").length;

  const content = (
    <MapCard
      title={
        alertsToShow && alertsToShow.length === 1
          ? intl.formatMessage({ id: `alerts.${alertsToShow[0].alertType}` })
          : intl.formatMessage({ id: "alerts.deforestation.alerts" })
      }
      titleIconName="Deforestation"
      position="bottom-right"
      footer={
        canSelectNeighboringAlert ? (
          <Button variant="secondary" onClick={handleSelectNeighboringPoints}>
            <FormattedMessage id="alerts.detail.selectAll" />
          </Button>
        ) : null
      }
    >
      <ul className="c-card__text c-card__list">
        <li>
          <FormattedMessage id="alerts.detail.type" />
        </li>
        <li>
          {intl.formatMessage({ id: "alerts.detail.issued" })}: {firstAlertDate.format("MMM DD, YYYY")}
          {showLastDate && " - " + lastAlertDate.format("MMM DD, YYYY")}
        </li>
        <li>
          {intl.formatMessage({ id: "alerts.detail.alertType" })}:{" "}
          {allAlertTypes.map(alertType => intl.formatMessage({ id: `alerts.${alertType}` })).join(", ")}
        </li>

        {numOfHighConfidenceAlerts > 0 && (
          <li>
            {intl.formatMessage({ id: "alerts.detail.confidenceLevel" })}:{" "}
            {intl.formatMessage({
              id: `alerts.detail.confidenceLevel.${
                numOfHighConfidenceAlerts === alertsToShow.length ? "high" : "high.multiple"
              }`
            })}
          </li>
        )}
      </ul>

      <OptionalWrapper data={!canSelectNeighboringAlert}>
        <div className="text-neutral-700 text-base p-4 bg-neutral-400 rounded-md mt-6">
          <Icon className="align-middle mr-2" name="InfoBubble" size={20} />
          <span>{intl.formatMessage({ id: "alerts.detail.select.neighboring.alerts" })}</span>
        </div>
      </OptionalWrapper>
    </MapCard>
  );

  return portal ? ReactDOM.createPortal(content, portal) : content;
};

export default AlertsDetailCard;
