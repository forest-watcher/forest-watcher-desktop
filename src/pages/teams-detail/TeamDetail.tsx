import { FC, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { TPropsFromRedux } from "./TeamDetailContainer";
import Hero from "../../components/layouts/Hero";
import Article from "../../components/layouts/Article";

type TParams = {
  teamId: string;
};

export interface IOwnProps extends RouteComponentProps<TParams> {}

type IProps = IOwnProps & TPropsFromRedux;

const TeamDetail: FC<IProps> = props => {
  const { team, teamMembers } = props;

  // ToDo: Create a util for this
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

  const deleteTeam = () => {
    // ToDo
  };

  // ToDo: On initial load team and members won't have been fetched
  if (!team || !teamMembers) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Hero
        title="teams.details.name"
        titleValues={{ name: team.attributes.name }}
        action={{ name: "teams.details.delete", callback: deleteTeam }}
      />
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.managers"
          titleValues={{ num: manages.length }}
        >
          <div>{JSON.stringify(manages)}</div>
        </Article>
      </div>
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.monitors"
          titleValues={{ num: monitors.length }}
        >
          <div>{JSON.stringify(monitors)}</div>
        </Article>
      </div>
    </>
  );
};

export default TeamDetail;
