import Article from "components/layouts/Article";
import Hero from "components/layouts/Hero/Hero";
import DataTable, { IRowAction } from "components/ui/DataTable/DataTable";
import AcceptOrDecline from "pages/teams/invitation/actions/AcceptOrDecline";
import { FC } from "react";
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

interface IProps extends RouteComponentProps {}

const Invitation: FC<IProps> = props => {
  const { match } = props;
  const intl = useIntl();
  const actionMatch = useRouteMatch<TParams>({ path: `${match.url}/:actionType/:teamId/`, exact: true });

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
        titleValues={{ num: 5 }}
        backLink={{ name: "teams.details.back", to: "/teams" }}
        actions={
          <Link to={`${match.url}/accept/all`} className="c-button c-button--primary">
            <FormattedMessage id="teams.invitation.accept.all" />
          </Link>
        }
      />
      <div className="l-content c-teams-details">
        <Article>
          <div className="u-responsive-table">
            <DataTable<TTeamInvitationsDataTable>
              className="u-w-100"
              rows={[
                {
                  id: "1",
                  name: "Team 1",
                  userRole: intl.formatMessage({ id: "teams.details.table.userRole.manager" })
                },
                {
                  id: "2",
                  name: "Team 2",
                  userRole: intl.formatMessage({ id: "teams.details.table.userRole.monitor" })
                }
              ]}
              columnOrder={[
                { key: "name", name: "teams.details.table.header.teamName" },
                { key: "userRole", name: "teams.details.table.header.userRole" }
              ]}
              rowActions={[acceptInvitation, declineInvitation]}
            />
          </div>
        </Article>
      </div>

      <AcceptOrDecline isOpen={!!actionMatch} actionType={actionMatch?.params.actionType || "accept"} />
    </>
  );
};

export default Invitation;
