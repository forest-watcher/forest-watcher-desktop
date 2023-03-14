import { TeamMemberModel } from "generated/core/coreSchemas";
import useGetTeamDetails from "hooks/querys/teams/useGetTeamDetails";
import { FC, useEffect, useMemo } from "react";
import { useHistory, Link, useParams, useLocation } from "react-router-dom";
import { toastr } from "react-redux-toastr";
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
import Loader from "components/ui/Loader";
import EditTeam from "./actions/EditTeam";
import AddTeamMember from "./actions/AddTeamMember";
import EditTeamMember from "./actions/EditTeamMember";
import DeleteTeam from "./actions/DeleteTeam";
import RemoveTeamMember from "./actions/RemoveTeamMember";
import { TTeamsDetailDataTableAction } from "./types";
import { sortByString } from "helpers/table";
import RemoveAreaFromTeam from "pages/area-view/actions/RemoveAreaFromTeam";
import useGetAreas from "hooks/querys/areas/useGetAreas";
import { AreaResponse } from "generated/core/coreResponses";

export type TParams = {
  teamId: string;
};

export interface IProps {
  isAddingTeamMember?: boolean;
  isEditingTeamMember?: boolean;
  isRemovingTeamMember?: boolean;
  isEditingTeam?: boolean;
  isDeletingTeam?: boolean;
  isDeletingTeamArea?: boolean;
}

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
    isAddingTeamMember = false,
    isEditingTeamMember = false,
    isRemovingTeamMember = false,
    isEditingTeam = false,
    isDeletingTeam = false,
    isDeletingTeamArea = false
  } = props;

  const location = useLocation();
  const { teamId } = useParams<{ teamId: string }>();
  const history = useHistory();
  const intl = useIntl();
  const {
    data: { areasByTeam },
    isFetching: isFetchingAreas
  } = useGetAreas();

  /* Queries */
  const {
    data: team,
    managers,
    monitors,
    userIsAdmin,
    userIsManager,
    isLoading: isTeamLoading
  } = useGetTeamDetails(teamId);

  const teamAreas = useMemo(() => {
    if (!areasByTeam) {
      return [];
    }

    // @ts-ignore incorrect schema
    const found = areasByTeam.find(teamArea => teamArea.team?.id === teamId);

    return found?.areas ? found.areas : [];
  }, [areasByTeam, teamId]);

  // If the team wasn't found, then redirect to the teams summary page.
  useEffect(() => {
    if (!isTeamLoading && !team) {
      toastr.warning(intl.formatMessage({ id: "errors.team.detail" }), "");
      history.push("/teams");
    }
  }, [history, intl, isTeamLoading, team]);

  /**
   * Map each member from the API to translated data table rows
   * @param members members from the API
   */
  const mapMembersToRows = useMemo(
    () => (members: TeamMemberModel[]) =>
      members.map<TTeamDetailDataTable>((member, index) => {
        let statusSuffix: typeof member.status | "administrator" | "left" = member.status;
        if (member.role === "administrator") {
          statusSuffix = "administrator";
        } else if (member.role === "left") {
          statusSuffix = "left";
        }

        return {
          // @ts-ignore `_id` not typed checked
          id: member._id,
          name: member.name || member.userId || "",
          email: member.email,
          status: intl.formatMessage({ id: `teams.details.table.status.${statusSuffix}` }),
          statusSuffix,
          userId: member.userId
        };
      }),
    [intl]
  );

  /**
   * Map each area from the API to translated data table rows
   * @param areas members from the API
   */
  const mapAreasToRows = useMemo(
    () => (teamAreas: AreaResponse[]) =>
      teamAreas.map(area => {
        return {
          id: area?.data?.id || "",
          name: area?.data?.attributes?.name || "",
          templates:
            area?.data?.attributes?.reportTemplate
              //@ts-ignore
              ?.map(template => template.name[template.defaultLanguage] || "")
              .filter(name => !!name)
              .join(", ") || ""
        };
      }),
    []
  );

  const makeManager: TTeamsDetailDataTableAction = {
    name: "teams.details.table.actions.manager",
    value: "makeManager",
    href: memberRow => `${location.pathname}/edit/${memberRow.id}/manager`,
    shouldShow: memberRow => {
      return memberRow.statusSuffix === "confirmed";
    }
  };

  const makeMonitor: TTeamsDetailDataTableAction = {
    name: "teams.details.table.actions.monitor",
    value: "makeMonitor",
    href: memberRow => `${location.pathname}/edit/${memberRow.id}/monitor`
  };

  const makeAdmin: TTeamsDetailDataTableAction = {
    name: "teams.details.table.actions.admin",
    value: "makeAdmin",
    href: memberRow => `${location.pathname}/edit/${memberRow.userId}/admin`,
    shouldShow: memberRow => {
      return userIsAdmin && memberRow.statusSuffix === "confirmed";
    }
  };

  const removeMember: TTeamsDetailDataTableAction = {
    name: "teams.details.table.actions.remove",
    value: "removeFromTeam",
    href: memberRow => `${location.pathname}/remove/${memberRow.id}`
  };

  const removeArea: TAreaDataTableAction = {
    name: "areas.details.teams.removeArea.title",
    value: "remove",
    href: memberRow => `${location.pathname}/removeArea/${memberRow.id}`
  };

  if (!team) {
    return <Loader isLoading />;
  }

  return (
    <>
      <Loader isLoading={isTeamLoading || isFetchingAreas} />
      <Hero
        title="teams.details.name"
        titleValues={{ name: team?.attributes?.name || "" }}
        actions={
          <>
            {userIsManager && (
              <Link to={`${location.pathname}/edit`} className="c-teams-details__edit-btn c-button c-button--primary">
                <FormattedMessage id="teams.details.edit" />
              </Link>
            )}
            {userIsAdmin && (
              <Link to={`${location.pathname}/delete`} className="c-button c-button--secondary-light-text">
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
          titleValues={{ num: managers.length }}
          size="small"
        >
          <DataTable<TTeamDetailDataTable>
            className="u-w-100"
            rows={mapMembersToRows(managers)}
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
              <Link to={`${location.pathname}/add/monitor`} className="c-button c-button--primary">
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
      <EditTeam isOpen={isEditingTeam} currentName={team?.attributes?.name || ""} />
      <DeleteTeam isOpen={isDeletingTeam} teamId={teamId} />
      <RemoveAreaFromTeam isOpen={isDeletingTeamArea} />
    </>
  );
};

export default TeamDetail;
