import { FC, useEffect, useMemo } from "react";
import Card from "../../ui/Card/Card";
import EditIcon from "assets/images/icons/Edit.svg";
import { FormattedMessage } from "react-intl";
import { TGFWTeamsState } from "modules/gfwTeams";
import { TPropsFromRedux } from "./TeamCardContainer";

export interface IOwnProps {
  team: TGFWTeamsState["data"][number];
}

type IProps = TPropsFromRedux & IOwnProps;

const TeamCard: FC<IProps> = props => {
  const { team, getTeamMembers, teamMembers } = props;

  useEffect(() => getTeamMembers(), [getTeamMembers]);

  const [manages, monitors] = useMemo(
    () =>
      teamMembers.reduce<[typeof teamMembers, typeof teamMembers]>(
        (acc, teamMember) => {
          if (
            (teamMember.attributes.role === "administrator" || teamMember.attributes.role === "manager") &&
            teamMember.attributes.userId
          ) {
            acc[0].push(teamMember);
          } else if (teamMember.attributes.userId) {
            acc[1].push(teamMember);
          }
          return acc;
        },
        [[], []]
      ),
    [teamMembers]
  );

  return (
    <Card size="large" className="c-teams__card">
      <div className="c-teams__title">
        <div>
          <Card.Title className="u-margin-top-none">{team.attributes.name}</Card.Title>
        </div>
        <Card.Cta to={`/teams/${team.id}`} iconSrc={EditIcon}>
          <FormattedMessage id="common.manage" />
        </Card.Cta>
      </div>

      <Card size="large" className={"c-teams__card c-teams--nested-card"}>
        <div>
          <h3 className="c-teams__sub-title">
            <FormattedMessage id="teams.managers" values={{ num: manages.length }} />
          </h3>
          <p>{manages.map(i => i.attributes.userId).join(", ")}</p>
        </div>
        <div>
          <h3 className="c-teams__sub-title">
            <FormattedMessage id="teams.monitors" values={{ num: monitors.length }} />
          </h3>
          <p>{monitors.map(i => i.attributes.userId).join(", ")}</p>
        </div>
      </Card>
    </Card>
  );
};

export default TeamCard;
