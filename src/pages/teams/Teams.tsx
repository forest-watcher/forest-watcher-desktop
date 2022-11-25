import { FC, useEffect, useMemo } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { TPropsFromRedux } from "./TeamsContainer";
import EmptyState from "components/ui/EmptyState/EmptyState";
import Hero from "components/layouts/Hero/Hero";
import Article from "components/layouts/Article";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import TeamsListing from "components/teams-listing/TeamsListing";
import Button from "components/ui/Button/Button";
import useGetUserId from "hooks/useGetUserId";
import CreateTeam from "./actions/CreateTeam";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import EmptyStateIcon from "assets/images/icons/EmptyTeams.svg";
import { fireGAEvent } from "helpers/analytics";
import { TeamActions, TeamLabels } from "types/analytics";

interface IProps extends TPropsFromRedux, RouteComponentProps {
  isCreatingTeam: boolean;
}

const Teams: FC<IProps> = props => {
  const {
    teams,
    myInvites,
    getUserTeams,
    getMyTeamInvites,
    numOfActiveFetches,
    isCreatingTeam = false,
    match,
    isLoading
  } = props;

  const intl = useIntl();
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
    <div className="relative">
      <Hero title="teams.name" />
      <Loader isLoading={isLoading} />
      {myInvites.length > 0 && (
        <div className="l-team-invitations l-content--neutral-400">
          <div className="row column">
            <div className="l-team-invitations__row">
              <FormattedMessage id="teams.invitation.banner" values={{ num: myInvites.length }}>
                {txt => <span className="l-team-invitations__title">{txt}</span>}
              </FormattedMessage>

              <Link to={`${match.path}/invitations`} className="c-button c-button--primary">
                <FormattedMessage id="teams.invitation.view" values={{ num: myInvites.length }} />
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* No teams are in state but fetches are being made - show nothing to the user */}
      {/* No teams are in state and fetches have finished  - show empty state to the user */}
      {/* Teams are in state                               - show the teams to the user */}
      {!teams.length && numOfActiveFetches > 0 ? null : !teams.length && numOfActiveFetches === 0 ? (
        <div className="l-content l-content--neutral-400">
          <div className="row column">
            <EmptyState
              iconUrl={EmptyStateIcon}
              title={intl.formatMessage({ id: "teams.empty.state.title" })}
              text={intl.formatMessage({ id: "teams.empty.state.subTitle" })}
              ctaText={intl.formatMessage({ id: "teams.create" })}
              ctaTo={`${match.path}/create`}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="l-content c-teams">
            <Article
              className="c-teams__heading"
              title="teams.managedByMe"
              titleValues={{ num: managedTeams.length.toString() }}
              actions={
                <Link
                  to={`${match.path}/create`}
                  onClick={() =>
                    fireGAEvent({
                      category: "Teams",
                      action: TeamActions.teamCreation,
                      label: TeamLabels.TeamCreationStart
                    })
                  }
                >
                  <Button variant="primary">
                    <img src={PlusIcon} alt="" role="presentation" className="c-button__inline-icon" />
                    <FormattedMessage id="teams.create" />
                  </Button>
                </Link>
              }
            >
              <TeamsListing teams={managedTeams} canManage />
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
        </>
      )}

      <CreateTeam isOpen={isCreatingTeam} />
    </div>
  );
};

export default Teams;
