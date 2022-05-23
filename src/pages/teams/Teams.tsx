import { FC, useEffect, useMemo } from "react";
import { TPropsFromRedux } from "./TeamContainer";
import Hero from "components/layouts/Hero";
import Article from "components/layouts/Article";
import ReactGA from "react-ga";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import { FormattedMessage } from "react-intl";
import TeamsListing from "components/teams-listing/TeamsListing";
import Button from "../../components/ui/Button/Button";
import useGetUserId from "hooks/useGetUserId";

interface IProps extends TPropsFromRedux {}

const Teams: FC<IProps> = props => {
  const { teams, myInvites, getUserTeams, getMyTeamInvites } = props;

  const userId = useGetUserId();

  useEffect(() => {
    if (userId) {
      getUserTeams(userId);
      getMyTeamInvites();
    }
  }, [getUserTeams, getMyTeamInvites, userId]);

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
      {myInvites.length > 0 && (
        <div className="l-team-invitations l-content--neutral-400">
          <div className="row column">
            <div className="row l-team-invitations__row">
              <FormattedMessage id="teams.invitation.banner" values={{ num: myInvites.length }}>
                {txt => <span className="l-team-invitations__title">{txt}</span>}
              </FormattedMessage>

              <Button variant="primary">
                <FormattedMessage id="teams.invitation.accept" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="l-content c-teams">
        <Article
          className="c-teams__heading"
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
      <div className="l-content l-content--neutral-400 c-teams">
        <Article
          className="c-teams__heading"
          title="teams.joinedByMe"
          titleValues={{ num: joinedTeams.length.toString() }}
        >
          <TeamsListing teams={joinedTeams} />
        </Article>
      </div>
    </div>
  );
};

export default Teams;
