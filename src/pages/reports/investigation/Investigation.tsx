import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Route, RouteComponentProps, Switch, useHistory, useParams, useRouteMatch } from "react-router-dom";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import AreaDetailsControlPanel from "./control-panels/AreaDetailsContainer";
import { FormValues, LAYERS } from "./control-panels/AreaDetails";
import AreaListControlPanel from "./control-panels/AreaList";
import { TParams } from "./types";
import { TPropsFromRedux } from "./InvestigationContainer";
import { BASEMAPS } from "constants/mapbox";
import AreaDetailCard from "components/ui/Map/components/cards/AreaDetail";
import { getAreaTeams } from "helpers/areas";
import { TAreasInTeam } from "services/area";
import { AllGeoJSON } from "@turf/turf";
import useZoomToGeojson from "hooks/useZoomToArea";
import { TGetAllAnswers } from "services/reports";
import { Layer, Source } from "react-map-gl";
import useUrlQuery from "hooks/useUrlQuery";
import useFindArea from "hooks/useFindArea";
import { setupMapImages } from "helpers/map";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";
import { fireGAEvent } from "helpers/analytics";
import { MonitoringActions, MonitoringLabel } from "types/analytics";

interface IProps extends RouteComponentProps, TPropsFromRedux {}

interface IAreaCardProps {
  areasInUsersTeams: TAreasInTeam[];
  numberOfReports?: number;
}

const AreaCardWrapper: FC<IAreaCardProps> = ({ areasInUsersTeams, numberOfReports }) => {
  const { areaId } = useParams<TParams>();
  const urlQuery = useUrlQuery();
  const scrollToTeamId = useMemo(() => urlQuery.get("scrollToTeamId"), [urlQuery]);

  const history = useHistory();

  const area = useFindArea(areaId);

  const selectedAreaGeoData = useMemo(() => area?.attributes.geostore.geojson, [area]);
  //@ts-ignore
  useZoomToGeojson(selectedAreaGeoData as AllGeoJSON);
  return (
    area && (
      <AreaDetailCard
        className="c-map-control-panel"
        area={area}
        teams={getAreaTeams(area.id, areasInUsersTeams)}
        numberOfReports={numberOfReports}
        position="top-left"
        onBack={() =>
          history.push(
            `/reporting/investigation?scrollToAreaId=${areaId}${
              scrollToTeamId ? `&scrollToTeamId=${scrollToTeamId}` : ""
            }`
          )
        }
        onStartInvestigation={() =>
          fireGAEvent({
            category: "Monitoring",
            action: MonitoringActions.Investigation,
            label: MonitoringLabel.StartedInvestigation
          })
        }
        onManageArea={() =>
          fireGAEvent({
            category: "Monitoring",
            action: MonitoringActions.ManagedArea,
            label: MonitoringLabel.StartedFromMonitoring
          })
        }
      />
    )
  );
};

const InvestigationPage: FC<IProps> = props => {
  const { match, allAnswers, basemaps, areasInUsersTeams, selectedLayers } = props;
  const [showReports, setShowReports] = useState(true);
  const [mapStyle, setMapStyle] = useState<string | undefined>(undefined);
  const [isPlanet, setIsPlanet] = useState(false);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [currentPlanetPeriod, setCurrentPlanetPeriod] = useState("");
  const [currentProc, setCurrentProc] = useState<"" | "cir">("");
  const [contextualLayerUrls, setContextualLayerUrls] = useState<string[]>([]);
  const [basemapKey, setBasemapKey] = useState<undefined | string>();
  const history = useHistory();
  const [filteredAnswers, setFilteredAnswers] = useState<TGetAllAnswers["data"] | null>(null);
  let selectedAreaMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId", exact: false });
  let investigationMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId/start", exact: true });

  const handleMapLoad = (evt: MapboxEvent) => {
    setMapRef(evt.target);
  };

  useEffect(() => {
    if (mapRef) {
      console.log("setting images");
      try {
        setupMapImages(mapRef);
      } catch (err) {
        // Issue with mapbox losing references to images.
        // Reset them all on style change.
        // It may error because some may still exist.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle, isPlanet]);

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
    if (!investigationMatch) {
      history.push("/reporting/investigation");
    }
  }, [history, investigationMatch]);

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
      onMapLoad={handleMapLoad}
      focusAllAreas={!selectedAreaMatch}
      selectedAreaId={selectedAreaMatch?.params.areaId}
      showReports={showReports && !!selectedAreaMatch}
      answers={filteredAnswers || answersBySelectedArea}
      mapStyle={mapStyle}
      currentPlanetBasemap={
        basemaps.length && isPlanet ? basemaps.find(bm => bm.name === currentPlanetPeriod) || basemaps[0] : undefined
      }
      currentProc={currentProc}
      showTeamAreas
      cooperativeGestures={false}
    >
      <Switch>
        <Route exact path={`${match.url}`} component={AreaListControlPanel} />
        <Route exact path={`${match.url}/:areaId`}>
          <AreaCardWrapper areasInUsersTeams={areasInUsersTeams} numberOfReports={answersBySelectedArea?.length} />
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
