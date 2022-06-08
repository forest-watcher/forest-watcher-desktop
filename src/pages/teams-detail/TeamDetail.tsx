import { FC, useEffect, useMemo, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { TPropsFromRedux } from "./TeamDetailContainer";
import { makeManager, makeMonitor, removeMember } from "./actions";
import Hero from "components/layouts/Hero";
import Article from "components/layouts/Article";
import DataTable from "components/ui/DataTable/DataTable";
import type { TTeamDetailDataTable, TTeamsDetailDataTableColumns } from "./types";
import Button from "components/ui/Button/Button";
import { FormattedMessage, useIntl } from "react-intl";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import useGetUserId from "hooks/useGetUserId";
import Loader from "components/ui/Loader";
import EditTeam from "./actions/EditTeam";
import DeleteTeam from "./actions/DeleteTeam";

type TParams = {
  teamId: string;
};

export interface IOwnProps extends RouteComponentProps<TParams> {
  isEditingTeam?: boolean;
  isDeletingTeam?: boolean;
}

type IProps = IOwnProps & TPropsFromRedux;

const columnOrder: TTeamsDetailDataTableColumns[] = [
  { key: "userId", name: "teams.details.table.header.name" },
  { key: "email", name: "teams.details.table.header.user" }
];

const columnOrderWithStatus: TTeamsDetailDataTableColumns[] = [
  ...columnOrder,
  { key: "status", name: "teams.details.table.header.status" }
];

const TeamDetail: FC<IProps> = props => {
  const {
    team,
    teamMembers,
    getUserTeams,
    getTeamMembers,
    userIsManager,
    numOfActiveFetches,
    isEditingTeam = false,
    isDeletingTeam = false,
    match
  } = props;
  const { teamId } = match.params;
  const [fetched, setFetched] = useState<boolean>(false);
  const history = useHistory();
  const intl = useIntl();

  const userId = useGetUserId();

  useEffect(() => {
    // If the component has attempted to fetch the teams and the fetches have
    // finished but the team was still not found, then redirect to the teams
    // summary page.
    if (numOfActiveFetches === 0 && !team && fetched) {
      toastr.warning(intl.formatMessage({ id: "errors.team.detail" }), "");
      history.push("/teams");
    }
  }, [intl, teamId, history, fetched, team, numOfActiveFetches]);

  useEffect(() => {
    if (!team) {
      getUserTeams(userId);
      getTeamMembers(teamId);
      setFetched(true);
    }
  }, [getTeamMembers, teamId, userId, team, getUserTeams]);

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

  const editTeam = () => {
    history.push(`${match.url}/edit`);
  };

  const deleteTeam = () => {
    history.push(`${match.url}/delete`);
  };

  if (!team) {
    return <Loader isLoading />;
  }

  return (
    <>
      <Loader isLoading={numOfActiveFetches > 0} />
      <Hero
        title="teams.details.name"
        titleValues={{ name: team.attributes.name }}
        action={
          userIsManager
            ? { name: "teams.details.delete", variant: "secondary-light-text", callback: deleteTeam }
            : undefined
        }
        backLink={{ name: "teams.details.back", to: "/teams" }}
      >
        {userIsManager && (
          <Button className="c-teams-details__edit-btn" variant="primary" onClick={editTeam}>
            <FormattedMessage id="teams.details.edit" />
          </Button>
        )}
      </Hero>
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.managers"
          titleValues={{ num: manages.length }}
          actions={
            userIsManager && (
              <Button variant="primary">
                <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
                <FormattedMessage id="teams.details.add.managers" />
              </Button>
            )
          }
        >
          <div className="u-responsive-table">
            <DataTable<TTeamDetailDataTable>
              className="u-w-100"
              rows={manages.map(m => m.attributes)}
              columnOrder={userIsManager ? columnOrderWithStatus : columnOrder}
              rowActions={userIsManager ? [makeMonitor, removeMember] : undefined}
            />
          </div>
        </Article>
      </div>
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.monitors"
          titleValues={{ num: monitors.length }}
          actions={
            userIsManager && (
              <Button variant="primary">
                <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
                <FormattedMessage id="teams.details.add.monitors" />
              </Button>
            )
          }
        >
          <div className="u-responsive-table">
            <DataTable<TTeamDetailDataTable>
              className="u-w-100"
              rows={monitors.map(m => m.attributes)}
              columnOrder={userIsManager ? columnOrderWithStatus : columnOrder}
              rowActions={userIsManager ? [makeManager, removeMember] : undefined}
            />
          </div>
        </Article>
      </div>

      <EditTeam isOpen={isEditingTeam} currentName={team.attributes.name} />
      <DeleteTeam isOpen={isDeletingTeam} teamId={teamId} />
    </>
  );
};

export default TeamDetail;
