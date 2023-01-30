import { TeamsResponse } from "generated/core/coreResponses";
import { FC } from "react";
import TeamCard from "./team-card/TeamCardContainer";
import useGetAreas from "hooks/querys/areas/useGetAreas";

interface IProps {
  teams: TeamsResponse["data"];
  canManage?: boolean;
}

const TeamsListing: FC<IProps> = props => {
  const { teams, canManage = false } = props;

  const {
    data: { areasByTeam }
  } = useGetAreas();

  return (
    <div className="c-teams__listing">
      {teams?.map(team => (
        <div className="c-teams__grid-item" key={team.id}>
          <TeamCard team={team} canManage={canManage} areasByTeam={areasByTeam || []} />
        </div>
      ))}
    </div>
  );
};

export default TeamsListing;
