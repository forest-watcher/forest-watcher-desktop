import { FC } from "react";
import { TGFWTeamsState } from "modules/gfwTeams";
import TeamCard from "./team-card/TeamCard";

interface IProps {
  teams: TGFWTeamsState["data"];
}

const TeamsListing: FC<IProps> = props => {
  const { teams } = props;

  return (
    <div className="c-teams__listing">
      {teams.map(team => (
        <div className="c-teams__grid-item" key={team.id}>
          <TeamCard team={team} />
        </div>
      ))}
    </div>
  );
};

export default TeamsListing;
