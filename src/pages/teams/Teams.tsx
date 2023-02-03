import OptionalWrapper from "components/extensive/OptionalWrapper";
import useGetTeamInvites from "hooks/querys/teams/useGetTeamInvites";
import useGetUserTeams from "hooks/querys/teams/useGetUserTeams";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import EmptyState from "components/ui/EmptyState/EmptyState";
import Hero from "components/layouts/Hero/Hero";
import Article from "components/layouts/Article";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import TeamsListing from "components/teams-listing/TeamsListing";
import Button from "components/ui/Button/Button";
import CreateTeam from "./actions/CreateTeam";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import EmptyStateIcon from "assets/images/icons/EmptyTeams.svg";
import { fireGAEvent } from "helpers/analytics";
import { TeamActions, TeamLabels } from "types/analytics";

interface IProps {
  isCreatingTeam: boolean;
}

const Teams: FC<IProps> = props => {
  const { isCreatingTeam = false } = props;

  const location = useLocation();
  const intl = useIntl();

  /* Queries */
  // Get all the User's Teams
  const { data: userTeams, managedTeams, joinedTeams, isLoading } = useGetUserTeams();
  // Get all the User's Team Invites
  const { data: userTeamInvites } = useGetTeamInvites();

  return (
    <div className="relative">
      <Hero title="teams.name" />
      <Loader isLoading={isLoading} />

      {/* User Invite Banner */}
      <OptionalWrapper data={(userTeamInvites?.length && userTeamInvites?.length > 0) || false}>
        <div className="l-team-invitations l-content--neutral-400">
          <div className="row column">
            <div className="l-team-invitations__row">
              <FormattedMessage id="teams.invitation.banner" values={{ num: userTeamInvites?.length }}>
                {txt => <span className="l-team-invitations__title">{txt}</span>}
              </FormattedMessage>

              <Link to={`${location.pathname}/invitations`} className="c-button c-button--primary">
                <FormattedMessage id="teams.invitation.view" values={{ num: userTeamInvites?.length }} />
              </Link>
            </div>
          </div>
        </div>
      </OptionalWrapper>

      {/* [0] The teams fetch is Loading - show nothing to the user */}
      {/* [1] No Teams were found        - show empty state to the user */}
      {/* [3] Teams were found           - show the teams to the user */}
      <OptionalWrapper
        data={!isLoading}
        // [0]
      >
        <OptionalWrapper
          data={(userTeams?.length && userTeams?.length > 0) || false}
          // [1]
          elseComponent={
            <div className="l-content l-content--neutral-400">
              <div className="row column">
                <EmptyState
                  iconUrl={EmptyStateIcon}
                  title={intl.formatMessage({ id: "teams.empty.state.title" })}
                  text={intl.formatMessage({ id: "teams.empty.state.subTitle" })}
                  ctaText={intl.formatMessage({ id: "teams.create" })}
                  ctaTo={`${location.pathname}/create`}
                />
              </div>
            </div>
          }
        >
          {/* [3] */}
          <div className="l-content c-teams">
            {/* Teams the User manages */}
            <Article
              className="c-teams__heading"
              title="teams.managedByMe"
              titleValues={{ num: managedTeams.length.toString() }}
              actions={
                <Link
                  to={`${location.pathname}/create`}
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
            {/* Teams the User is a member off but doesn't manage */}
            <Article
              className="c-teams__heading"
              title="teams.joinedByMe"
              titleValues={{ num: joinedTeams.length.toString() }}
            >
              <TeamsListing teams={joinedTeams} />
            </Article>
          </div>
        </OptionalWrapper>
      </OptionalWrapper>

      {/* Create Team Modal */}
      <CreateTeam isOpen={isCreatingTeam} />
    </div>
  );
};

export default Teams;
