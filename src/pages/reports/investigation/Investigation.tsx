import { FC, useCallback, useMemo, useState } from "react";
import { Route, RouteComponentProps, Switch, useHistory, useParams, useRouteMatch } from "react-router-dom";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import AreaDetailsControlPanel from "./control-panels/AreaDetailsContainer";
import { FormValues, LAYERS } from "./control-panels/AreaDetails";
import AreaListControlPanel from "./control-panels/AreaList";
import { TParams } from "./types";
import { TPropsFromRedux } from "./InvestigationContainer";
import { BASEMAPS } from "constants/mapbox";
import AreaDetailCard from "components/ui/Map/components/cards/AreaDetail";
import { getNumberOfTeamsInArea } from "helpers/areas";
import { TAreasInTeam } from "services/area";
import { AllGeoJSON } from "@turf/turf";
import useZoomToGeojson from "hooks/useZoomToArea";
import { TGetAllAnswers } from "services/reports";
import { Layer, Source } from "react-map-gl";
import useUrlQuery from "hooks/useUrlQuery";

interface IProps extends RouteComponentProps, TPropsFromRedux {}

interface IAreaCardProps {
  areas: any;
  areasInUsersTeams: TAreasInTeam[];
}

const AreaCardWrapper: FC<IAreaCardProps> = ({ areas, areasInUsersTeams }) => {
  const { areaId } = useParams<TParams>();
  const urlQuery = useUrlQuery();
  const scrollToTeamId = useMemo(() => urlQuery.get("scrollToTeamId"), [urlQuery]);

  const history = useHistory();

  const selectedAreaGeoData = useMemo(() => areas[areaId]?.attributes.geostore.geojson, [areaId, areas]);
  useZoomToGeojson(selectedAreaGeoData as AllGeoJSON);

  return (
    <AreaDetailCard
      className="c-map-control-panel"
      area={areas[areaId]}
      numberOfTeams={getNumberOfTeamsInArea(areaId, areasInUsersTeams)}
      position="top-left"
      onBack={() =>
        history.push(
          `/reporting/investigation?scrollToAreaId=${areaId}${
            scrollToTeamId ? `&scrollToTeamId=${scrollToTeamId}` : ""
          }`
        )
      }
    />
  );
};

const InvestigationPage: FC<IProps> = props => {
  const { match, allAnswers, basemaps, areas, areasInUsersTeams, selectedLayers } = props;
  const [showReports, setShowReports] = useState(true);
  const [mapStyle, setMapStyle] = useState<string | undefined>(undefined);
  const [isPlanet, setIsPlanet] = useState(false);
  const [currentPlanetPeriod, setCurrentPlanetPeriod] = useState("");
  const [currentProc, setCurrentProc] = useState<"" | "cir">("");
  const [contextualLayerUrls, setContextualLayerUrls] = useState<string[]>([]);
  const [basemapKey, setBasemapKey] = useState<undefined | string>();
  const history = useHistory();
  const [filteredAnswers, setFilteredAnswers] = useState<TGetAllAnswers["data"] | null>(null);
  let selectedAreaMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId", exact: false });

  const answersBySelectedArea = useMemo(() => {
    return allAnswers?.filter(
      answer =>
        answer.attributes?.areaOfInterest === selectedAreaMatch?.params.areaId &&
        Boolean(answer?.attributes?.clickedPosition?.length)
    );
  }, [allAnswers, selectedAreaMatch?.params.areaId]);

  const handleAreaSelect = useCallback(
    (areaId: string) => {
      history.push(`/reporting/investigation/${areaId}`);
    },
    [history]
  );

  const handleAreaDeselect = useCallback(() => {
    history.push("/reporting/investigation");
  }, [history]);

  const handleControlPanelChange = (resp: FormValues) => {
    setShowReports(Boolean(resp.layers && resp.layers?.indexOf(LAYERS.reports) > -1));
    const basemapKey = Object.keys(BASEMAPS).find(
      key => BASEMAPS[key as keyof typeof BASEMAPS].key === resp.currentMap
    );
    const basemap = BASEMAPS[basemapKey as keyof typeof BASEMAPS];
    if (basemap) {
      setMapStyle(basemap.style);
      setIsPlanet(resp.currentMap === BASEMAPS.planet.key);
    }

    setCurrentPlanetPeriod(resp.currentPlanetPeriod || "");
    setCurrentProc(resp.currentPlanetImageType === "nat" ? "" : resp.currentPlanetImageType || "");
    setContextualLayerUrls(resp.contextualLayers?.map(layer => selectedLayers[layer].attributes.url) || []);
    setBasemapKey(resp.currentMap);
  };

  const handleFiltersChange = (filters: TGetAllAnswers["data"]) => {
    if (filters?.length === answersBySelectedArea?.length) {
      setFilteredAnswers(null);
    } else {
      setFilteredAnswers(filters);
    }
  };

  return (
    <UserAreasMap
      onAreaSelect={handleAreaSelect}
      onAreaDeselect={handleAreaDeselect}
      focusAllAreas={!selectedAreaMatch}
      selectedAreaId={selectedAreaMatch?.params.areaId}
      showReports={showReports && !!selectedAreaMatch}
      answers={filteredAnswers || answersBySelectedArea}
      mapStyle={mapStyle}
      currentPlanetBasemap={
        basemaps.length && isPlanet ? basemaps.find(bm => bm.name === currentPlanetPeriod) || basemaps[0] : undefined
      }
      currentProc={currentProc}
    >
      <Switch>
        <Route exact path={`${match.url}`} component={AreaListControlPanel} />
        <Route exact path={`${match.url}/:areaId`}>
          <AreaCardWrapper areas={areas} areasInUsersTeams={areasInUsersTeams} />
        </Route>
        <Route exact path={`${match.url}/:areaId/start`}>
          <AreaDetailsControlPanel
            onChange={handleControlPanelChange}
            answers={answersBySelectedArea}
            onFilterUpdate={handleFiltersChange}
            defaultBasemap={basemapKey}
          />
          {contextualLayerUrls.map(url => (
            <Source id={url} type="raster" tiles={[url]} key={url}>
              <Layer id={`${url}-layer`} type="raster" />
            </Source>
          ))}
        </Route>
      </Switch>
    </UserAreasMap>
  );
};

export default InvestigationPage;
