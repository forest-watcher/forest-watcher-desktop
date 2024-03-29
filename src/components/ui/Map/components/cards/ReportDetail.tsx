import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import { fireGAEvent } from "helpers/analytics";
import useAlertTypeString from "hooks/useAlertTypeString";
import { useAppSelector } from "hooks/useRedux";
import { components } from "interfaces/forms";
import { FC, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { TAreasInTeam } from "services/area";
import { MonitoringActions, MonitoringLabel } from "types/analytics";
import MapCard from "./MapCard";
import { TPropsFromRedux } from "./ReportDetailContainer";

export type TAnswer = components["responses"]["Answer"]["content"]["application/json"]["data"];

interface IParams extends TPropsFromRedux {
  answers: TAnswer[];
  onClose: () => void;
}

const ReportDetailCard: FC<IParams> = ({ answers, areasInUsersTeams, onClose }) => {
  const intl = useIntl();
  const [answer, setCurrentAnswer] = useState<TAnswer | undefined>(undefined);
  const history = useHistory();
  const portal = useAppSelector(state => state.layers.portal);
  const { pathname } = useLocation();

  const alertTypesString = useAlertTypeString(answer);

  const teams = useMemo(() => {
    if (!answer) {
      return [];
    }
    const teams: TAreasInTeam["team"][] = [];

    areasInUsersTeams.forEach(areaTeam => {
      const areaIndex = areaTeam.areas.findIndex(area => answer.attributes?.areaOfInterest === area.data.id);
      if (areaIndex > -1) {
        teams.push(areaTeam.team);
      }
    });

    return teams.filter((value, index, self) => value && self.findIndex(t => t?.id === value?.id) === index);
  }, [answer, areasInUsersTeams]);

  useEffect(() => {
    if (answers.length === 1) {
      setCurrentAnswer(answers[0]);
    }
  }, [answers]);

  const content = (
    <MapCard
      title={answer?.attributes?.reportName ?? intl.formatMessage({ id: "reports.select" })}
      titleIconName="mapCardIcons/Reports"
      position="bottom-right"
      className="c-map-card--area-detail"
      onOutsideClick={onClose}
      footer={
        answer?.id ? (
          <Button
            className="w-full"
            onClick={() => {
              fireGAEvent({
                category: "Monitoring",
                action: MonitoringActions.Investigation,
                label: MonitoringLabel.ViewReport
              });
              history.push(`/reporting/reports/${answer?.attributes?.report}/answers/${answer?.id}?prev=${pathname}`);
            }}
          >
            <FormattedMessage id="reports.preview.view" />
          </Button>
        ) : undefined
      }
    >
      {answer && (
        <ul className="c-card__text c-card__list">
          <li>
            <FormattedMessage id="reports.preview.type" />
          </li>
          <OptionalWrapper data={!!answer.attributes?.createdAt}>
            <li>
              <FormattedMessage
                id="reports.preview.dateUploaded"
                values={{
                  date: intl.formatDate(answer.attributes?.createdAt, {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                  })
                }}
              />
            </li>
          </OptionalWrapper>
          <OptionalWrapper data={teams.length > 0}>
            <li>
              <FormattedMessage
                id="reports.preview.teams"
                values={{ teams: teams.map(team => team?.attributes?.name || "").join(", ") }}
              />
            </li>
          </OptionalWrapper>
          <OptionalWrapper data={!!alertTypesString}>
            <li>
              <FormattedMessage id="reports.preview.alertType" values={{ alertType: alertTypesString }} />
            </li>
          </OptionalWrapper>
          <OptionalWrapper data={!!answer.attributes?.areaOfInterestName}>
            <li>
              <FormattedMessage id="reports.preview.area" values={{ name: answer.attributes?.areaOfInterestName }} />
            </li>
          </OptionalWrapper>
          <OptionalWrapper data={!!answer.attributes?.fullName}>
            <li>
              <FormattedMessage id="reports.preview.submittedBy" values={{ name: answer.attributes?.fullName }} />
            </li>
          </OptionalWrapper>
        </ul>
      )}
      {!answer && answers.length > 1 && (
        <ul className="c-card__text c-card__list">
          {answers.map((ans, index) => (
            <li
              key={index} // Sometimes have duplicates, better to go with Index
            >
              <button
                onClick={() => {
                  setCurrentAnswer(ans);
                }}
                className="u-text-break-spaces u-text-left c-link"
              >
                {ans?.attributes?.reportName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </MapCard>
  );

  return portal ? ReactDOM.createPortal(content, portal) : content;
};

export default ReportDetailCard;
