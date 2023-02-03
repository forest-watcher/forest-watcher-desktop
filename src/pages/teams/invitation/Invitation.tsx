import Article from "components/layouts/Article";
import Hero from "components/layouts/Hero/Hero";
import DataTable, { IRowAction } from "components/ui/DataTable/DataTable";
import { sortByString } from "helpers/table";
import useGetTeamInvites from "hooks/querys/teams/useGetTeamInvites";
import AcceptOrDecline from "pages/teams/invitation/actions/AcceptOrDecline";
import { FC, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useLocation, useRouteMatch } from "react-router-dom";

type TParams = {
  actionType: "accept" | "decline";
  teamId: string;
};

type TTeamInvitationsDataTable = {
  id: string;
  name: string;
  userRole: string;
};

interface IProps {}

const Invitation: FC<IProps> = props => {
  const location = useLocation();
  const intl = useIntl();
  const actionMatch = useRouteMatch<TParams>({ path: `${location.pathname}/:actionType/:teamId/`, exact: true });

  /* Queries */
  // Get all the User's Team Invites
  const { data: userTeamInvites } = useGetTeamInvites();

  const invitationRows = useMemo(
    () =>
      userTeamInvites?.map(invitation => ({
        id: invitation.id!,
        name: invitation.attributes?.name || "",
        userRole: intl.formatMessage({ id: `teams.details.table.userRole.${invitation.attributes?.userRole}` })
      })) || [],
    [intl, userTeamInvites]
  );

  const acceptInvitation: IRowAction<TTeamInvitationsDataTable> = {
    name: "teams.invitation.accept",
    value: "acceptInvitation",
    href: teamRow => `${location.pathname}/accept/${teamRow.id}`
  };

  const declineInvitation: IRowAction<TTeamInvitationsDataTable> = {
    name: "teams.invitation.decline",
    value: "declineInvitation",
    href: teamRow => `${location.pathname}/decline/${teamRow.id}`
  };

  return (
    <>
      <Hero
        title="teams.invitation.title"
        titleValues={{ num: invitationRows.length }}
        backLink={{ name: "teams.details.back", to: "/teams" }}
        actions={
          invitationRows.length ? (
            <Link to={`${location.pathname}/accept/all`} className="c-button c-button--primary">
              <FormattedMessage id="teams.invitation.acceptAll" />
            </Link>
          ) : (
            <></>
          )
        }
      />
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.invitation.subTitle"
          titleValues={{ num: invitationRows.length }}
        >
          <DataTable<TTeamInvitationsDataTable>
            className="u-w-100"
            rows={invitationRows}
            columnOrder={[
              { key: "name", name: "teams.details.table.header.teamName", sortCompareFn: sortByString },
              { key: "userRole", name: "teams.details.table.header.userRole", sortCompareFn: sortByString }
            ]}
            rowActions={[acceptInvitation, declineInvitation]}
          />
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
