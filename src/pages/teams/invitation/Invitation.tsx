import Article from "components/layouts/Article";
import Hero from "components/layouts/Hero/Hero";
import DataTable, { IRowAction } from "components/ui/DataTable/DataTable";
import AcceptOrDecline from "pages/teams/invitation/actions/AcceptOrDecline";
import { TPropsFromRedux } from "pages/teams/invitation/InvitationContainer";
import { FC, useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, RouteComponentProps, useRouteMatch } from "react-router-dom";

type TParams = {
  actionType: "accept" | "decline";
  teamId: string;
};

type TTeamInvitationsDataTable = {
  id: string;
  name: string;
  userRole: string;
};

interface IProps extends TPropsFromRedux, RouteComponentProps {}

const Invitation: FC<IProps> = props => {
  const { match, invitations, invitationsFetched, getMyTeamInvites } = props;
  const intl = useIntl();
  const actionMatch = useRouteMatch<TParams>({ path: `${match.url}/:actionType/:teamId/`, exact: true });

  useEffect(() => {
    if (!invitationsFetched) getMyTeamInvites();
  }, [getMyTeamInvites, invitationsFetched]);

  const invitationRows = useMemo(
    () =>
      invitations.map(invitation => ({
        id: invitation.id,
        name: invitation.attributes.name,
        userRole: intl.formatMessage({ id: `teams.details.table.userRole.${invitation.attributes.userRole}` })
      })),
    [intl, invitations]
  );

  const acceptInvitation: IRowAction<TTeamInvitationsDataTable> = {
    name: "teams.invitation.accept",
    value: "acceptInvitation",
    href: teamRow => `${match.url}/accept/${teamRow.id}`
  };

  const declineInvitation: IRowAction<TTeamInvitationsDataTable> = {
    name: "teams.invitation.decline",
    value: "declineInvitation",
    href: teamRow => `${match.url}/decline/${teamRow.id}`
  };

  return (
    <>
      <Hero
        title="teams.invitation.title"
        titleValues={{ num: invitationRows.length }}
        backLink={{ name: "teams.details.back", to: "/teams" }}
        actions={
          <>
            {invitationRows.length && (
              <Link to={`${match.url}/accept/all`} className="c-button c-button--primary">
                <FormattedMessage id="teams.invitation.acceptAll" />
              </Link>
            )}
          </>
        }
      />
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.invitation.subTitle"
          titleValues={{ num: invitationRows.length }}
        >
          <div className="u-responsive-table">
            <DataTable<TTeamInvitationsDataTable>
              className="u-w-100"
              rows={invitationRows}
              columnOrder={[
                { key: "name", name: "teams.details.table.header.teamName" },
                { key: "userRole", name: "teams.details.table.header.userRole" }
              ]}
              rowActions={[acceptInvitation, declineInvitation]}
            />
          </div>
        </Article>
      </div>

      <AcceptOrDecline
        isOpen={!!actionMatch}
        actionType={actionMatch?.params.actionType || "accept"}
        teamId={actionMatch?.params.teamId || ""}
      />
    </>
  );
};

export default Invitation;
