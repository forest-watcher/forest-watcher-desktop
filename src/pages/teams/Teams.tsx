import OptionalWrapper from "components/extensive/OptionalWrapper";
import { useGetV3GfwTeamsUserUserId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
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
  const { myInvites, getMyTeamInvites, isCreatingTeam = false, match } = props;

  const intl = useIntl();
  const userId = useGetUserId();

  const { httpAuthHeader } = useAccessToken();
  const { data: userTeams, isLoading } = useGetV3GfwTeamsUserUserId(
    {
      pathParams: {
        userId
      },
      headers: httpAuthHeader
    },
    {
      enabled: !!userId
    }
  );

  useEffect(() => {
    if (userId) {
      getMyTeamInvites();
    }
  }, [getMyTeamInvites, userId]);

  const managedTeams = useMemo(
    () =>
      userTeams?.data?.filter(
        team => team.attributes?.userRole === "administrator" || team.attributes?.userRole === "manager"
      ) || [],
    [userTeams]
  );

  const joinedTeams = useMemo(
    () =>
      userTeams?.data?.filter(
        team => team.attributes?.userRole !== "administrator" && team.attributes?.userRole !== "manager"
      ) || [],
    [userTeams]
  );

  return (
    <div className="relative">
      <Hero title="teams.name" />
      <Loader isLoading={isLoading} />

      {/* User Invite Banner */}
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

      {/* [0] The teams fetch is Loading - show nothing to the user */}
      {/* [1] No Teams were found        - show empty state to the user */}
      {/* [3] Teams were found           - show the teams to the user */}
      <OptionalWrapper
        data={!isLoading}
        // [0]
      >
        <OptionalWrapper
          data={(userTeams?.data?.length && userTeams?.data?.length > 0) || false}
          // [1]
          elseComponent={
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
