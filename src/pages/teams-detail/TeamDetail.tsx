import { FC, useEffect, useMemo, useState } from "react";
import { RouteComponentProps, useHistory, Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { TPropsFromRedux } from "./TeamDetailContainer";
import Hero from "components/layouts/Hero/Hero";
import Article from "components/layouts/Article";
import DataTable from "components/ui/DataTable/DataTable";
import type {
  TAreaDataTable,
  TAreaDataTableAction,
  TAreaDataTableColumns,
  TTeamDetailDataTable,
  TTeamsDetailDataTableColumns
} from "./types";
import { FormattedMessage, useIntl } from "react-intl";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import useGetUserId from "hooks/useGetUserId";
import Loader from "components/ui/Loader";
import EditTeam from "./actions/EditTeam";
import AddTeamMember from "./actions/AddTeamMember";
import EditTeamMember from "./actions/EditTeamMember";
import DeleteTeam from "./actions/DeleteTeam";
import RemoveTeamMember from "./actions/RemoveTeamMember";
import { TTeamsDetailDataTableAction } from "./types";
import { TGFWTeamsState } from "modules/gfwTeams";
import { sortByString } from "helpers/table";
import RemoveAreaFromTeam from "pages/area-view/actions/RemoveAreaFromTeam";

export type TParams = {
  teamId: string;
};

export interface IOwnProps extends RouteComponentProps<TParams> {
  isAddingTeamMember?: boolean;
  isEditingTeamMember?: boolean;
  isRemovingTeamMember?: boolean;
  isEditingTeam?: boolean;
  isDeletingTeam?: boolean;
  isDeletingTeamArea?: boolean;
}

type IProps = IOwnProps & TPropsFromRedux;

const columnOrder: TTeamsDetailDataTableColumns[] = [
  { key: "name", name: "teams.details.table.header.name", sortCompareFn: sortByString },
  { key: "email", name: "teams.details.table.header.user", sortCompareFn: sortByString }
];

const columnOrderWithStatus: TTeamsDetailDataTableColumns[] = [
  ...columnOrder,
  { key: "status", name: "teams.details.table.header.status", sortCompareFn: sortByString }
];

const areaColumnOrder: TAreaDataTableColumns[] = [
  { key: "name", name: "teams.details.table.header.name", sortCompareFn: sortByString },
  { key: "templates", name: "teams.details.table.header.templates", sortCompareFn: sortByString }
];

const TeamDetail: FC<IProps> = props => {
  const {
    team,
    teamMembers,
    teamAreas,
    getUserTeams,
    getTeamMembers,
    userIsManager,
    userIsAdmin,
    numOfActiveFetches,
    isAddingTeamMember = false,
    isEditingTeamMember = false,
    isRemovingTeamMember = false,
    isEditingTeam = false,
    isDeletingTeam = false,
    isDeletingTeamArea = false,
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
          if (teamMember.attributes.role === "administrator" || teamMember.attributes.role === "manager") {
            acc[0].push(teamMember);
          } else {
            acc[1].push(teamMember);
          }
          return acc;
        },
        [[], []]
      ),
    [teamMembers]
  );

  /**
   * Map each member from the API to translated data table rows
   * @param members members from the API
   */
  const mapMembersToRows = useMemo(
    () => (members: TGFWTeamsState["members"][string]) =>
      members.map<TTeamDetailDataTable>(member => {
        let statusSuffix: typeof member.attributes.status | "administrator" | "left" = member.attributes.status;
        if (member.attributes.role === "administrator") {
          statusSuffix = "administrator";
        } else if (member.attributes.role === "left") {
          statusSuffix = "left";
        }

        return {
          id: member.id,
          name: member.attributes.name || member.attributes.userId || "",
          email: member.attributes.email,
          status: intl.formatMessage({ id: `teams.details.table.status.${statusSuffix}` }),
          statusSuffix,
          userId: member.attributes.userId
        };
      }),
    [intl]
  );

  /**
   * Map each area from the API to translated data table rows
   * @param areas members from the API
   */
  const mapAreasToRows = useMemo(
    () => (teamAreas: any) =>
      teamAreas.map((area: any) => {
        return {
          id: area.id,
          name: area.attributes.name,
          templates: area.attributes.reportTemplate
            .map((template: any) => template.name[template.defaultLanguage])
            .join(", ")
        };
      }),
    []
  );

  const makeManager: TTeamsDetailDataTableAction = {
    name: "teams.details.table.actions.manager",
    value: "makeManager",
    href: memberRow => `${match.url}/edit/${memberRow.id}/manager`,
    shouldShow: memberRow => {
      return memberRow.statusSuffix === "confirmed";
    }
  };

  const makeMonitor: TTeamsDetailDataTableAction = {
    name: "teams.details.table.actions.monitor",
    value: "makeMonitor",
    href: memberRow => `${match.url}/edit/${memberRow.id}/monitor`
  };

  const makeAdmin: TTeamsDetailDataTableAction = {
    name: "teams.details.table.actions.admin",
    value: "makeAdmin",
    href: memberRow => `${match.url}/edit/${memberRow.userId}/admin`,
    shouldShow: memberRow => {
      return userIsAdmin && memberRow.statusSuffix === "confirmed";
    }
  };

  const removeMember: TTeamsDetailDataTableAction = {
    name: "teams.details.table.actions.remove",
    value: "removeFromTeam",
    href: memberRow => `${match.url}/remove/${memberRow.id}`
  };

  const removeArea: TAreaDataTableAction = {
    name: "areas.details.teams.removeArea.title",
    value: "remove",
    href: memberRow => `${match.url}/removeArea/${memberRow.id}`
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
        actions={
          <>
            {userIsManager && (
              <Link to={`${match.url}/edit`} className="c-teams-details__edit-btn c-button c-button--primary">
                <FormattedMessage id="teams.details.edit" />
              </Link>
            )}
            {userIsAdmin && (
              <Link to={`${match.url}/delete`} className="c-button c-button--secondary-light-text">
                <FormattedMessage id="teams.details.delete" />
              </Link>
            )}
          </>
        }
        backLink={{ name: "teams.details.back", to: "/teams" }}
      />
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.managers"
          titleValues={{ num: manages.length }}
          size="small"
        >
          <DataTable<TTeamDetailDataTable>
            className="u-w-100"
            rows={mapMembersToRows(manages)}
            columnOrder={userIsManager ? columnOrderWithStatus : columnOrder}
            rowActions={userIsManager ? [makeAdmin, makeMonitor, removeMember] : undefined}
          />
        </Article>
      </div>
      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.monitors"
          titleValues={{ num: monitors.length }}
          size="small"
          actions={
            userIsManager && (
              <Link to={`${match.url}/add/monitor`} className="c-button c-button--primary">
                <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
                <FormattedMessage id="teams.details.add.monitors" />
              </Link>
            )
          }
        >
          <DataTable<TTeamDetailDataTable>
            className="u-w-100"
            rows={mapMembersToRows(monitors)}
            columnOrder={userIsManager ? columnOrderWithStatus : columnOrder}
            rowActions={userIsManager ? [makeManager, removeMember] : undefined}
          />
        </Article>
      </div>

      <div className="l-content c-teams-details">
        <Article
          className="c-teams-details__heading"
          title="teams.details.areas"
          titleValues={{ num: teamAreas.length }}
          size="small"
        >
          <DataTable<TAreaDataTable>
            className="u-w-100"
            rows={mapAreasToRows(teamAreas)}
            columnOrder={areaColumnOrder}
            rowActions={[removeArea]}
          />
        </Article>
      </div>

      <AddTeamMember isOpen={isAddingTeamMember} />
      <EditTeamMember isOpen={isEditingTeamMember} />
      <RemoveTeamMember isOpen={isRemovingTeamMember} />
      <EditTeam isOpen={isEditingTeam} currentName={team.attributes.name} />
      <DeleteTeam isOpen={isDeletingTeam} teamId={teamId} />
      <RemoveAreaFromTeam isOpen={isDeletingTeamArea} />
    </>
  );
};

export default TeamDetail;
