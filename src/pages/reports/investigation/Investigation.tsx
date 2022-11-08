import { TAlertsById } from "components/ui/Map/components/cards/AlertsDetail";
import { DefaultRequestThresholds, EAlertTypes, ViirsRequestThresholds } from "constants/alerts";
import { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import { LAYERS } from "pages/reports/investigation/control-panels/start-investigation/StartInvestigation";
import { TParams } from "./types";
import { TPropsFromRedux } from "./InvestigationContainer";
import { BASEMAPS, PLANET_BASEMAP } from "constants/mapbox";
import { TGetAllAnswers } from "services/reports";
import { LngLat } from "react-map-gl";
import { setupMapImages } from "helpers/map";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";

// Control Panel Views
import AreaListControlPanel from "./control-panels/AreaList";
import AreaDetailControlPanel from "pages/reports/investigation/control-panels/AreaDetail";
import StartInvestigationControlPanel from "pages/reports/investigation/control-panels/start-investigation/StartInvestigationContainer";
import CreateAssignmentControlPanel from "pages/reports/investigation/control-panels/CreateAssignment/CreateAssignment";
import Layers from "./components/Layers";
import MapComparison from "components/map-comparison/MapComparison";

interface IProps extends RouteComponentProps, TPropsFromRedux {}

const mapContainerStyle: CSSProperties = { position: "absolute", top: 0, bottom: 0, width: "100%" };

export type TFormValues = {
  layers?: string[];
  currentMap?: string;
  showPlanetImagery?: string[];
  currentPlanetPeriod?: string;
  currentPlanetImageType?: "nat" | "cir";
  contextualLayers?: string[];
  showAlerts: ["true"];
  showOpenAssignments: ["true"];
  alertTypesShown: "all" | EAlertTypes;
  alertTypesRequestThreshold: number;
  alertTypesViirsRequestThreshold: number;
  selectedAlerts: TAlertsById[];
  singleSelectedLocation?: LngLat;
};

const InvestigationPage: FC<IProps> = props => {
  const { match, allAnswers, basemaps, areasInUsersTeams, selectedLayers } = props;
  const [mapStyle, setMapStyle] = useState<string | undefined>(undefined);
  const [isPlanet, setIsPlanet] = useState(false);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [currentPlanetPeriod, setCurrentPlanetPeriod] = useState("");
  const [currentProc, setCurrentProc] = useState<"" | "cir">("");
  const [contextualLayerUrls, setContextualLayerUrls] = useState<string[]>([]);
  const [basemapKey, setBasemapKey] = useState<undefined | string>();
  const history = useHistory();
  const [filteredAnswers, setFilteredAnswers] = useState<TGetAllAnswers["data"] | null>(null);
  const [lockAlertSelections, setLockAlertSelections] = useState(false);
  let selectedAreaMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId", exact: false });
  let investigationMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId/start", exact: false });

  const handleMapLoad = (evt: MapboxEvent) => {
    setMapRef(evt.target);
  };

  useEffect(() => {
    if (mapRef) {
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

  const defaultValues = useMemo<TFormValues>(
    () => ({
      layers: [LAYERS.reports],
      currentMap: basemapKey,
      showPlanetImagery: [],
      showAlerts: ["true"],
      showOpenAssignments: ["true"],
      alertTypesShown: "all",
      alertTypesRequestThreshold: DefaultRequestThresholds[0].requestThreshold,
      alertTypesViirsRequestThreshold: ViirsRequestThresholds[0].requestThreshold,
      selectedAlerts: []
    }),
    [basemapKey]
  );

  // Investigation Panel Form
  const formhook = useForm<TFormValues>({
    defaultValues
  });

  const watcher = formhook.watch();

  useEffect(() => {
    const subscription = formhook.watch(values => {
      const basemapKey = Object.keys(BASEMAPS).find(
        key => BASEMAPS[key as keyof typeof BASEMAPS].key === values.currentMap
      );
      const basemap = BASEMAPS[basemapKey as keyof typeof BASEMAPS];

      if (basemap) {
        setMapStyle(basemap.style);
      }

      setCurrentPlanetPeriod(values.currentPlanetPeriod || "");
      setCurrentProc(values.currentPlanetImageType === "nat" ? "" : values.currentPlanetImageType || "");
      setContextualLayerUrls(values.contextualLayers?.map(layer => selectedLayers[layer].attributes.url) || []);
      setBasemapKey(values.currentMap);
      setIsPlanet(values.showPlanetImagery?.[0] === PLANET_BASEMAP.key);
    });

    return () => subscription.unsubscribe();
  }, [formhook, selectedLayers]);

  useEffect(() => {
    if (!investigationMatch) {
      formhook.reset(defaultValues);
    }
  }, [defaultValues, formhook, investigationMatch]);

  const handleFiltersChange = (filters: TGetAllAnswers["data"]) => {
    if (filters?.length === answersBySelectedArea?.length) {
      setFilteredAnswers(null);
    } else {
      setFilteredAnswers(filters);
    }
  };

  return (
    <MapComparison
      className="h-full"
      renderBefore={cb => {
        return (
          <UserAreasMap
            onAreaSelect={handleAreaSelect}
            onAreaDeselect={handleAreaDeselect}
            onMapLoad={e => {
              handleMapLoad(e);
              cb(e.target);
            }}
            focusAllAreas={!selectedAreaMatch}
            selectedAreaId={selectedAreaMatch?.params.areaId}
            showReports={watcher.layers?.includes(LAYERS.reports) && !!selectedAreaMatch}
            answers={filteredAnswers || answersBySelectedArea}
            mapStyle={mapStyle}
            currentPlanetBasemap={
              basemaps.length && isPlanet
                ? basemaps.find(bm => bm.name === currentPlanetPeriod) || basemaps[0]
                : undefined
            }
            currentProc={currentProc}
            showTeamAreas
            cooperativeGestures={false}
            shouldWrapContainer={false}
            style={mapContainerStyle}
            uncontrolled
          >
            <FormProvider {...formhook}>
              <Switch>
                <Route exact path={`${match.url}`} component={AreaListControlPanel} />
                <Route exact path={`${match.url}/:areaId`}>
                  <AreaDetailControlPanel
                    areasInUsersTeams={areasInUsersTeams}
                    numberOfReports={answersBySelectedArea?.length}
                  />
                </Route>
                <Route exact path={`${match.url}/:areaId/start`}>
                  <StartInvestigationControlPanel
                    answers={answersBySelectedArea}
                    onFilterUpdate={handleFiltersChange}
                    defaultBasemap={basemapKey}
                  />
                </Route>

                <Route exact path={`${match.url}/:areaId/start/assignment`}>
                  <CreateAssignmentControlPanel setLockAlertSelections={setLockAlertSelections} />
                </Route>
              </Switch>

              <Layers contextualLayerUrls={contextualLayerUrls} lockAlertSelections={lockAlertSelections} />
            </FormProvider>
          </UserAreasMap>
        );
      }}
      renderAfter={cb => {
        return (
          <UserAreasMap
            onAreaSelect={handleAreaSelect}
            onAreaDeselect={handleAreaDeselect}
            onMapLoad={e => {
              handleMapLoad(e);
              cb(e.target);
            }}
            focusAllAreas={!selectedAreaMatch}
            selectedAreaId={selectedAreaMatch?.params.areaId}
            showReports={watcher.layers?.includes(LAYERS.reports) && !!selectedAreaMatch}
            answers={filteredAnswers || answersBySelectedArea}
            mapStyle={BASEMAPS.dark.style}
            currentPlanetBasemap={
              basemaps.length && isPlanet
                ? basemaps.find(bm => bm.name === currentPlanetPeriod) || basemaps[0]
                : undefined
            }
            currentProc={currentProc}
            showTeamAreas
            cooperativeGestures={false}
            shouldWrapContainer={false}
            style={mapContainerStyle}
            uncontrolled
          >
            <FormProvider {...formhook}>
              <Layers contextualLayerUrls={contextualLayerUrls} lockAlertSelections={lockAlertSelections} />
            </FormProvider>
          </UserAreasMap>
        );
      }}
    />
  );
};

export default InvestigationPage;
