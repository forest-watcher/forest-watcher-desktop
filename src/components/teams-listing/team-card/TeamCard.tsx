import { FC, useEffect, useMemo } from "react";
import Card from "../../ui/Card/Card";
import EditIcon from "assets/images/icons/Edit.svg";
import { FormattedMessage } from "react-intl";
import { TGFWTeamsState } from "modules/gfwTeams";
import { TPropsFromRedux } from "./TeamCardContainer";
import { TAreasByTeam } from "hooks/querys/areas/useGetAreas";

export interface IOwnProps {
  team: TGFWTeamsState["data"][number];
  canManage?: boolean;
  areasByTeam: TAreasByTeam;
}

export type IProps = TPropsFromRedux & IOwnProps;

const TeamCard: FC<IProps> = props => {
  const { team, getTeamMembers, teamMembers, teamAreas, canManage = false, areasByTeam } = props;
  useEffect(() => {
    getTeamMembers();
  }, [getTeamMembers]);

  const areasDetail = useMemo(
    // @ts-ignore incorrect typings
    () => areasByTeam.find(areasAndTeam => areasAndTeam.team?.id === team.id),
    [areasByTeam, team.id]
  );

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
        <div className="c-teams__title-text">
          <Card.Title className="u-margin-top-none">{team.attributes.name}</Card.Title>
        </div>

        <Card.Cta to={`/teams/${team.id}`} iconSrc={canManage ? EditIcon : undefined}>
          <FormattedMessage id={canManage ? "common.manage.team" : "common.view.team"} />
        </Card.Cta>
      </div>

      <Card size="large" className={"c-teams__card c-teams--nested-card c-teams--nested-card-people"}>
        <div>
          <h3 className="c-teams__sub-title">
            <FormattedMessage id="teams.managers" values={{ num: manages.length }} />
          </h3>
          <p>{manages.map(i => i.attributes.name || i.attributes.email).join(", ")}</p>
        </div>
        <div>
          <h3 className="c-teams__sub-title">
            <FormattedMessage id="teams.monitors" values={{ num: monitors.length }} />
          </h3>
          <p>{monitors.map(i => i.attributes.name || i.attributes.email).join(", ")}</p>
        </div>
      </Card>

      <Card size="large" className={"c-teams__card c-teams--nested-card"}>
        <div className="flex-container align-justify">
          <div className="c-teams__area-text">
            <h3 className="c-teams__sub-title">
              <FormattedMessage id="teams.summary.areas" />
            </h3>
            <p>
              {areasDetail
                ? areasDetail?.areas?.map(area => area?.data?.attributes?.name).join(", ")
                : teamAreas.join(", ")}
            </p>
          </div>
        </div>
      </Card>
    </Card>
  );
};

export default TeamCard;
