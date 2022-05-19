import { FC } from "react";
import styles from "./teams.module.scss";
import { TGFWTeamsState } from "modules/gfwTeams";
import TeamCard from "./TeamCard";

interface IProps {
  teams: TGFWTeamsState["data"];
}

const TeamsListing: FC<IProps> = props => {
  const { teams } = props;

  return (
    <div className={styles["c-teams__listing"]}>
      {teams.map(team => (
        <div className={styles["c-teams__grid-item"]} key={team.id}>
          <TeamCard team={team} />
        </div>
      ))}
    </div>
  );
};

export default TeamsListing;
