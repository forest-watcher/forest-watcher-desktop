import { FC, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import MapCard from "./MapCard";
import { components } from "interfaces/forms";
import useAlertTypeString from "hooks/useAlertTypeString";
import { TPropsFromRedux } from "./ReportDetailContainer";
import { TAreasInTeam } from "services/area";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import { useHistory } from "react-router-dom";

export type TAnswer = components["responses"]["Answer"]["content"]["application/json"]["data"];

interface IParams extends TPropsFromRedux {
  answers: TAnswer[];
}

const ReportDetailCard: FC<IParams> = ({ answers, areasInUsersTeams }) => {
  const intl = useIntl();
  const [answer, setCurrentAnswer] = useState<TAnswer | undefined>(undefined);
  const history = useHistory();

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

  return (
    <MapCard
      title={intl.formatMessage(
        { id: answer ? "reports.preview.comepletedTitle" : "reports.select" },
        { name: answer?.attributes?.reportName }
      )}
      position="bottom-right"
      className="c-map-card--area-detail"
      footer={
        <Button
          className="w-full"
          onClick={() => history.push(`/reporting/reports/${answer?.attributes?.report}/answers/${answer?.id}`)}
        >
          View Report
        </Button>
      }
    >
      {answer && (
        <ul className="c-card__text c-card__list">
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
};

export default ReportDetailCard;
