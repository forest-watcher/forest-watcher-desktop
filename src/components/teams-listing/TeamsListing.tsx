import { FC } from "react";
import { TGFWTeamsState } from "modules/gfwTeams";
import TeamCard from "./team-card/TeamCardContainer";

interface IProps {
  teams: TGFWTeamsState["data"];
  canManage?: boolean;
}

const TeamsListing: FC<IProps> = props => {
  const { teams, canManage = false } = props;

  return (
    <div className="c-teams__listing">
      {teams.map(team => (
        <div className="c-teams__grid-item" key={team.id}>
          <TeamCard team={team} canManage={canManage} />
        </div>
      ))}
    </div>
  );
};

export default TeamsListing;
