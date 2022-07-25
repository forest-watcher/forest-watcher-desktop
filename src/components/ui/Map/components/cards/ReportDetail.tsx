import { FC, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import MapCard from "./MapCard";
import { components } from "interfaces/forms";
import useAlertTypeString from "hooks/useAlertTypeString";
import { TPropsFromRedux } from "./ReportDetailContainer";

export type TAnswer = components["schemas"]["Answer"];

interface IParams extends TPropsFromRedux {
  answer: TAnswer;
}

const ReportDetailCard: FC<IParams> = ({ answer, areasInUsersTeams }) => {
  const intl = useIntl();

  const alertTypesString = useAlertTypeString(answer);

  const teams = useMemo(() => {
    const teams: any[] = [];

    areasInUsersTeams.forEach(areaTeam => {
      const areaIndex = areaTeam.areas.findIndex(area => answer.areaOfInterest === area.data.id);
      if (areaIndex > -1) {
        teams.push(areaTeam.team);
      }
    });

    return teams.filter((value, index, self) => self.findIndex(t => t.id === value.id) === index);
  }, [answer.areaOfInterest, areasInUsersTeams]);

  return (
    <MapCard
      title={intl.formatMessage({ id: "reports.preview.comepletedTitle" }, { name: answer.reportName })}
      position="bottom-right"
      className="c-map-card--area-detail"
    >
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
    </MapCard>
  );
};

export default ReportDetailCard;
