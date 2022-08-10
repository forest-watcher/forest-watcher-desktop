import Hero from "components/layouts/Hero/Hero";
import Map from "components/ui/Map/Map";
import { FC, useState, useEffect, useMemo } from "react";
import { MapboxEvent, Map as MapInstance } from "mapbox-gl";
import { FormattedMessage } from "react-intl";
import { TPropsFromRedux } from "./AreaViewContainer";
import { goToGeojson } from "helpers/map";
import Loader from "components/ui/Loader";
import Polygon from "components/ui/Map/components/layers/Polygon";
import Button from "components/ui/Button/Button";
import { Link, Route, RouteComponentProps, Switch, useRouteMatch } from "react-router-dom";
import Article from "components/layouts/Article";
import DataTable from "components/ui/DataTable/DataTable";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import AddTemplateModal from "./actions/AddTemplate";
import { TTeamDataTable, TTeamDataTableAction, TTemplateDataTable, TTemplateDataTableAction } from "./types";
import RemoveTemplateModal from "./actions/RemoveTemplate";
import useGetUserId from "hooks/useGetUserId";
import AddTeamModal from "./actions/AddTeam";
import RemoveTeamModal from "./actions/RemoveTeam";
import { sortByNumber, sortByString } from "helpers/table";

interface IProps extends TPropsFromRedux {}
export type TParams = {
  areaId: string;
};

const AreasView: FC<IProps & RouteComponentProps<TParams>> = ({
  geojson,
  area,
  loading,
  templates,
  match,
  getUserTeams,
  getAreaTeams,
  getTeamMembers,
  areaTeams,
  teamMembers,
  teams
}) => {
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  let { path, url } = useRouteMatch();
  const userId = useGetUserId();

  const templatesToAdd = useMemo(() => {
    return (
      templates?.filter(
        template => !area?.attributes.reportTemplate.find(areaTemplate => areaTemplate.id === template.id)
      ) || []
    );
  }, [area?.attributes.reportTemplate, templates]);

  const teamsToAdd = useMemo(() => {
    return teams?.filter(team => !areaTeams.find(areaTeam => areaTeam.data.id === team.id)) || [];
  }, [areaTeams, teams]);

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
    href: template => `${match.url}/template/remove/${template.id}`
  };

  const removeTeam: TTeamDataTableAction = {
    name: "areas.details.teams.remove.title",
    value: "remove",
    href: template => `${match.url}/team/remove/${template.id}`
  };

  useEffect(() => {
    if (area && userId) {
      // areaService.getAreaTeams(area.id);
      getAreaTeams(area.id);
      getUserTeams(userId);
    }
  }, [area, userId, getUserTeams, getAreaTeams]);

  useEffect(() => {
    if (areaTeams) {
      areaTeams.forEach(team => getTeamMembers(team.data.id));
    }
  }, [areaTeams, getTeamMembers]);

  return (
    <>
      <div className="c-area-manage">
        <Hero
          title="areas.manageAreaName"
          titleValues={{ name: area?.attributes.name ?? "" }}
          backLink={{ name: "areas.back", to: "/areas" }}
          actions={
            area ? (
              <>
                <Link to={`${url}/edit`} className="c-button c-button--primary">
                  <FormattedMessage id="common.edit" />
                </Link>
                <Button variant="secondary-light-text">
                  <FormattedMessage id="common.export" />
                </Button>
                <a
                  href={`${process.env.REACT_APP_FLAGSHIP_URL}/map/aoi/${area.id}`}
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

        {loading ? (
          <div className="c-map c-map--within-hero">
            <Loader isLoading />
          </div>
        ) : (
          area && (
            <Map className="c-map--within-hero" onMapLoad={handleMapLoad}>
              <Polygon id={area.id} label={area.attributes.name} data={geojson} />
            </Map>
          )
        )}
        <div className="l-content u-h-min-unset">
          <Article
            title="areas.details.templates"
            titleValues={{ num: area?.attributes.reportTemplate.length ?? 0 }}
            size="small"
            actions={
              <Link to={`${url}/template/add`} className="c-button c-button--primary">
                <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
                <FormattedMessage id="areas.details.templates.add.title" />
              </Link>
            }
          >
            {
              /* TS issue here, reportTemplate.length can be undefined */
              (area?.attributes.reportTemplate.length ?? 0) > 0 && (
                <div className="u-responsive-table">
                  <DataTable<TTemplateDataTable>
                    className="u-w-100"
                    rows={
                      area?.attributes.reportTemplate.map(template => ({
                        ...template,
                        //@ts-ignore
                        name: (template.name?.[template.defaultLanguage] as string) || "",
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
                </div>
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
              <Link to={`${url}/team/add`} className="c-button c-button--primary">
                <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
                <FormattedMessage id="areas.details.teams.add.title" />
              </Link>
            }
          >
            {areaTeams.length > 0 && (
              <div className="u-responsive-table">
                <DataTable<TTeamDataTable>
                  className="u-w-100"
                  rows={
                    areaTeams.map(team => ({
                      ...team.data,
                      //@ts-ignore
                      name: team.data.attributes.name || "",
                      openAssignments: 0,
                      reports: 0
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
              </div>
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
          <AddTeamModal teams={teamsToAdd} users={teamMembers} />
        </Route>
        <Route path={`${path}/team/remove/:teamId`}>
          <RemoveTeamModal />
        </Route>
      </Switch>
    </>
  );
};
export default AreasView;
