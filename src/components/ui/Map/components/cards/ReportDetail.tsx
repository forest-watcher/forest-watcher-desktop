import { FC, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import MapCard from "./MapCard";
import { components } from "interfaces/forms";
import useAlertTypeString from "hooks/useAlertTypeString";
import { TPropsFromRedux } from "./ReportDetailContainer";

export type TAnswer = components["schemas"]["Answer"];

interface IParams extends TPropsFromRedux {
  answers: TAnswer[];
}

const ReportDetailCard: FC<IParams> = ({ answers, areasInUsersTeams }) => {
  const intl = useIntl();
  const [answer, setCurrentAnswer] = useState<TAnswer | undefined>(undefined);


  const alertTypesString = useAlertTypeString(answer);

  const teams = useMemo(() => {
    if (!answer) {
      return [];
    }
    const teams: any[] = [];

    areasInUsersTeams.forEach(areaTeam => {
      const areaIndex = areaTeam.areas.findIndex(area => answer.areaOfInterest === area.data.id);
      if (areaIndex > -1) {
        teams.push(areaTeam.team);
      }
    });

    return teams.filter((value, index, self) => self.findIndex(t => t.id === value.id) === index);
  }, [answer, areasInUsersTeams]);

  useEffect(() => {
    if (answers.length === 1) {
      setCurrentAnswer(answers[0]);
    } else {
      setCurrentAnswer(undefined);
    }
  }, [answers]);

  return (
    <MapCard
      title={intl.formatMessage(
        { id: answer ? "reports.preview.comepletedTitle" : "reports.select" },
        { name: answer?.reportName }
      )}
      position="bottom-right"
      className="c-map-card--area-detail"
    >
      {answer && (
        <ul className="c-card__text c-card__list">
          <li>
            <FormattedMessage
              id="reports.preview.dateUploaded"
              values={{ date: intl.formatDate(answer.createdAt, { month: "short", day: "2-digit", year: "numeric" }) }}
            />
          </li>
          <li>
            <FormattedMessage
              id="reports.preview.monitors"
              values={{ teams: teams.map(team => team.attributes.name).join(", ") }}
            />
          </li>
          <li>
            <FormattedMessage id="reports.preview.alertType" values={{ alertType: alertTypesString }} />
          </li>
          <li>
            <FormattedMessage id="reports.preview.area" values={{ name: answer.areaOfInterestName }} />
          </li>
          <li>
            <FormattedMessage id="reports.preview.submittedBy" values={{ name: answer.fullName }} />
          </li>
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
                {ans.reportName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </MapCard>
  );
};

export default ReportDetailCard;
