import { FC, useEffect, useMemo } from "react";
import { TPropsFromRedux } from "./TeamContainer";
import Hero from "components/layouts/Hero";
import Article from "components/layouts/Article";
import ReactGA from "react-ga";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import { FormattedMessage } from "react-intl";
import TeamsListing from "components/teams-listing/TeamsListing";

interface IProps extends TPropsFromRedux {}

const Teams: FC<IProps> = props => {
  const { teams, getUserTeams, userId, getUser } = props;

  if (!userId) {
    getUser();
  }

  useEffect(() => {
    if (userId) getUserTeams(userId);
  }, [getUserTeams, userId]);

  const [managedTeams, joinedTeams] = useMemo(
    () =>
      teams.reduce<[typeof teams, typeof teams]>(
        (acc, team) => {
          if (team.attributes.userRole === "administrator" || team.attributes.userRole === "manager") {
            acc[0].push(team);
          } else {
            acc[1].push(team);
          }
          return acc;
        },
        [[], []]
      ),
    [teams]
  );

  return (
    <div>
      <Hero title="teams.name" />
      <div className="l-content">
        <Article
          title="teams.managedByMe"
          titleValues={{ num: managedTeams.length.toString() }}
          actions={
            <ReactGA.OutboundLink eventLabel="Add new team" to="/teams/create" className="c-button c-button--primary">
              <img src={PlusIcon} alt="" role="presentation" className="c-button__inline-icon" />
              <FormattedMessage id="teams.create" />
            </ReactGA.OutboundLink>
          }
        >
          <TeamsListing teams={managedTeams} />
        </Article>
      </div>
      <div className="l-content l-content--neutral-400">
        <Article title="teams.joinedByMe" titleValues={{ num: joinedTeams.length.toString() }}>
          <TeamsListing teams={joinedTeams} />
        </Article>
      </div>
    </div>
  );
};

export default Teams;
