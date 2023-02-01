import Hero from "components/layouts/Hero/Hero";
import Map from "components/ui/Map/Map";
import useGetAllReportAnswersForUser from "hooks/querys/reportAnwsers/useGetAllReportAnswersForUser";
import useGetUserTeams from "hooks/querys/teams/useGetUserTeams";
import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { MapboxEvent, Map as MapInstance } from "mapbox-gl";
import { FormattedMessage, useIntl } from "react-intl";
import { TPropsFromRedux } from "./AreaViewContainer";
import { goToGeojson } from "helpers/map";
import Loader from "components/ui/Loader";
import Polygon from "components/ui/Map/components/layers/Polygon";
import { Link, Route, RouteComponentProps, Switch, useHistory, useParams, useRouteMatch } from "react-router-dom";
import Article from "components/layouts/Article";
import DataTable from "components/ui/DataTable/DataTable";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import AddTemplateModal from "./actions/AddTemplate";
import { TTeamDataTable, TTeamDataTableAction, TTemplateDataTable, TTemplateDataTableAction } from "./types";
import RemoveTemplateModal from "./actions/RemoveTemplate";
import useGetUserId from "hooks/useGetUserId";
import AddTeamModal from "./actions/AddTeam";
import RemoveTeamModal from "./actions/RemoveTeam";
import { UnpackNestedValue } from "react-hook-form";
import ExportModal, { TExportForm } from "components/modals/exports/ExportModal";
import { exportService } from "services/exports";
import { AREA_EXPORT_FILE_TYPES } from "constants/export";
import { sortByNumber, sortByString } from "helpers/table";
import { toastr } from "react-redux-toastr";
import { useGetBackLink } from "hooks/useGetBackLink";
import { fireGAEvent } from "helpers/analytics";
import { AreaActions, AreaLabel } from "types/analytics";
import useGetTemplates from "hooks/querys/templates/useGetTemplates";
import { useGetV3GfwAreasAreaId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";

interface IProps extends TPropsFromRedux {}
export type TParams = {
  areaId: string;
};

const AreasView: FC<IProps & RouteComponentProps<TParams>> = props => {
  const { match, getAreaTeams, areaTeams } = props;
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  let { path, url } = useRouteMatch();
  const userId = useGetUserId();
  const history = useHistory();
  const intl = useIntl();
  const { areaId } = useParams<TParams>();

  const { backLinkTextKey } = useGetBackLink({ backLinkTextKey: "areas.back", backLink: "/areas" });

  /*
   * Queries
   */
  const { httpAuthHeader } = useAccessToken();
  // - Get All Templates
  const { templates } = useGetTemplates();
  // - Fetch Area by AreaId
  const { data: area, isLoading } = useGetV3GfwAreasAreaId({
    pathParams: { areaId: areaId || "" },
    headers: httpAuthHeader
  });
  // - Fetch all Report Answers
  const { data: allAnswers } = useGetAllReportAnswersForUser();
  // - Fetch all Teams the User is a member of
  const { data: userTeams, managedTeams } = useGetUserTeams();

  useEffect(() => {
    // Rare case, only other scroll tos are in routes.js for the top level nav
    window.scrollTo(0, 0);
  }, []);

  const isMyArea = area?.data?.attributes?.userId === userId;

  const canManage = useMemo(() => {
    // For Each team in the area
    let hasPermissions = isMyArea;
    areaTeams.forEach(team => {
      // Is this team a team that is Managed by the current logged-in user?
      if (managedTeams.find(managedTeam => managedTeam.id === team.data.id) && !hasPermissions) {
        hasPermissions = true;
      }
    });

    return hasPermissions;
  }, [areaTeams, isMyArea, managedTeams]);

  const geojson = useMemo(() => area?.data?.attributes?.geostore?.geojson, [area]);

  const templatesToAdd = useMemo(() => {
    return (
      templates?.filter(
        // @ts-ignore missing type
        template => !area?.data?.attributes?.reportTemplate?.find(areaTemplate => areaTemplate?._id === template?.id)
      ) || []
    );
  }, [area?.data?.attributes?.reportTemplate, templates]);

  const teamsToAdd = useMemo(() => {
    return userTeams?.filter(team => !areaTeams.find(areaTeam => areaTeam.data.id === team.id)) || [];
  }, [areaTeams, userTeams]);

  const handleMapLoad = (e: MapboxEvent) => {
    setMapRef(e.target);
  };

  useEffect(() => {
    if (geojson) {
      goToGeojson(mapRef, geojson, false);
    }
  }, [geojson, mapRef]);

  const removeTemplate: TTemplateDataTableAction = {
    name: "areas.details.templates.remove.title",
    value: "remove",
    href: template => `${match.url}/template/remove/${template.id}`,
    shouldShow: row => row.name !== "Forest Watcher Questionnaire"
  };

  const removeTeam: TTeamDataTableAction = {
    name: "areas.details.teams.remove.title",
    value: "remove",
    href: template => `${match.url}/team/remove/${template.id}`,
    shouldShow: () => canManage
  };

  useEffect(() => {
    if (area?.data?.id && userId) {
      getAreaTeams(area.data.id);
    }
  }, [area, getAreaTeams, userId]);

  const handleExport = useCallback(
    async (values: UnpackNestedValue<TExportForm>) => {
      // Do request
      if (area?.data?.id) {
        try {
          const { data } = await exportService.exportArea(area?.data?.id, values.fileType, values.email);
          return data;
        } catch (err) {
          // Do toast
          toastr.error(intl.formatMessage({ id: "export.error" }), "");
        }
      }
    },
    [intl, area]
  );

  return (
    <>
      <div className="c-area-manage">
        <Hero
          title="areas.manageAreaName"
          titleValues={{ name: area?.data?.attributes?.name ?? "" }}
          backLink={{ name: backLinkTextKey }}
          actions={
            area ? (
              <>
                {isMyArea && (
                  <Link to={`${url}/edit`} className="c-button c-button--primary">
                    <FormattedMessage id="common.edit" />
                  </Link>
                )}
                <Link to={`${url}/export`} className="c-button c-button--secondary-light-text">
                  <FormattedMessage id="common.export" />
                </Link>
                <a
                  href={`${process.env.REACT_APP_FLAGSHIP_URL}/map/aoi/${area.data?.id}`}
                  target="_blank"
                  rel="noopenner noreferrer"
                  className="c-button c-button--secondary-light-text"
                >
                  <FormattedMessage id="areas.viewInGfw" />
                </a>
              </>
            ) : (
              <></>
            )
          }
        />

        {isLoading ? (
          <div className="c-map c-map--within-hero">
            <Loader isLoading />
          </div>
        ) : (
          area &&
          geojson && (
            <Map className="c-map--within-hero" onMapLoad={handleMapLoad} showKeyLegend>
              <Polygon id={area?.data?.id || ""} label={area.data?.attributes?.name} data={geojson} />
            </Map>
          )
        )}
        <div className="l-content u-h-min-unset">
          <Article
            title="areas.details.templates"
            titleValues={{ num: area?.data?.attributes?.reportTemplate?.length ?? 0 }}
            size="small"
            actions={
              <Link
                to={`${url}/template/add`}
                className="c-button c-button--primary"
                onClick={() =>
                  fireGAEvent({
                    category: "Areas",
                    action: AreaActions.Managed,
                    label: AreaLabel.AddedTemplate
                  })
                }
              >
                <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
                <FormattedMessage id="areas.details.templates.add.title" />
              </Link>
            }
          >
            {
              /* TS issue here, reportTemplate.length can be undefined */
              (area?.data?.attributes?.reportTemplate?.length ?? 0) > 0 && (
                <DataTable<TTemplateDataTable>
                  className="u-w-100"
                  rows={
                    area?.data?.attributes?.reportTemplate?.map(template => ({
                      ...template,
                      // @ts-ignore `_id` not typed
                      id: template._id,
                      //@ts-ignore
                      name: (template?.name?.[template?.defaultLanguage] as string) || "",
                      openAssignments: 0
                    })) ?? []
                  }
                  columnOrder={[
                    {
                      key: "name",
                      name: "areas.details.templatesTable.header.name",
                      rowHref: row => `/templates/${row.id}`,
                      sortCompareFn: sortByString
                    }
                  ]}
                  rowActions={[removeTemplate]}
                />
              )
            }
          </Article>
        </div>
        <div className="l-content u-padding-top-none u-h-min-unset">
          <Article
            title="areas.details.teams"
            titleValues={{ num: areaTeams.length ?? 0 }}
            size="small"
            actions={
              canManage && (
                <Link
                  to={`${url}/team/add`}
                  className="c-button c-button--primary"
                  onClick={() =>
                    fireGAEvent({
                      category: "Areas",
                      action: AreaActions.Managed,
                      label: AreaLabel.AddedTeam
                    })
                  }
                >
                  <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
                  <FormattedMessage id="areas.details.teams.add.title" />
                </Link>
              )
            }
          >
            {areaTeams.length > 0 && (
              <DataTable<TTeamDataTable>
                className="u-w-100"
                rows={
                  areaTeams.map(team => ({
                    ...team.data,
                    name: team.data.attributes.name || "",
                    openAssignments: 0,
                    reports:
                      allAnswers?.reduce(
                        (total, item) => (item?.attributes?.teamId === team?.data?.id ? total + 1 : total),
                        0
                      ) || 0
                  })) ?? []
                }
                columnOrder={[
                  {
                    key: "name",
                    name: "areas.details.teamsTable.header.name",
                    rowHref: row => `/teams/${row.id}`,
                    sortCompareFn: sortByString
                  },
                  {
                    key: "reports",
                    name: "areas.details.teamsTable.header.reports",
                    sortCompareFn: (a, b, direction) => sortByNumber(a as number, b as number, direction)
                  }
                ]}
                rowActions={[removeTeam]}
              />
            )}
          </Article>
        </div>
      </div>
      <Switch>
        <Route path={`${path}/template/add`}>
          <AddTemplateModal templates={templatesToAdd} />
        </Route>
        <Route path={`${path}/template/remove/:templateId`}>
          <RemoveTemplateModal />
        </Route>
        <Route path={`${path}/team/add`}>
          <AddTeamModal teams={teamsToAdd} />
        </Route>
        <Route path={`${path}/team/remove/:teamId`}>
          <RemoveTeamModal />
        </Route>
        <Route path={`${path}/export`}>
          <ExportModal
            onSave={handleExport}
            onClose={() => history.goBack()}
            isOpen
            fileTypes={AREA_EXPORT_FILE_TYPES}
            fields={[]}
          />
        </Route>
      </Switch>
    </>
  );
};
export default AreasView;
