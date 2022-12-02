import { TAlertsById } from "types/map";
import { DefaultRequestThresholds, EAlertTypes, ViirsRequestThresholds } from "constants/alerts";
import { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom";
import UserAreasMap, { IProps as UserAreasMapProps } from "components/user-areas-map/UserAreasMap";
import { LAYERS } from "pages/reports/investigation/control-panels/start-investigation/StartInvestigation";
import { TParams } from "./types";
import { TPropsFromRedux } from "./InvestigationContainer";
import { BASEMAPS, PLANET_BASEMAP } from "constants/mapbox";
import { TGetAllAnswers } from "services/reports";
import { LngLat } from "react-map-gl";
import { setupMapImages } from "helpers/map";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";
//@ts-ignore
import breakpoints from "styles/utilities/_u-breakpoints.scss";

// Control Panel Views
import AreaListControlPanel from "./control-panels/AreaList";
import AreaDetailControlPanel from "pages/reports/investigation/control-panels/AreaDetail";
import StartInvestigationControlPanel from "pages/reports/investigation/control-panels/start-investigation/StartInvestigationContainer";
import CreateAssignmentControlPanel from "pages/reports/investigation/control-panels/CreateAssignment/CreateAssignment";
import Layers from "./components/Layers";
import MapComparison from "components/map-comparison/MapComparison";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import { useGetV3ContextualLayer } from "generated/clayers/clayersComponents";
import { useAccessToken } from "hooks/useAccessToken";

interface IProps extends RouteComponentProps, TPropsFromRedux {}

const mapContainerStyle: CSSProperties = { position: "absolute", top: 0, bottom: 0, width: "100%" };

export type ProcTypes = "nat" | "cir" | "";

export type TFormValues = {
  layers?: string[];
  currentMap?: string;
  showPlanetImagery?: string[];
  currentPlanetPeriodBefore?: string;
  currentPlanetImageTypeBefore?: ProcTypes;
  currentPlanetPeriodAfter?: string;
  currentPlanetImageTypeAfter?: ProcTypes;
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
  const { match, allAnswers, basemaps, areasInUsersTeams } = props;
  const [mapStyle, setMapStyle] = useState<string | undefined>(undefined);
  const [isPlanet, setIsPlanet] = useState(false);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [currentPlanetPeriod, setCurrentPlanetPeriod] = useState("");
  const [currentProc, setCurrentProc] = useState<ProcTypes>("");
  const [currentPlanetPeriodAfter, setCurrentPlanetPeriodAfter] = useState("");
  const [currentProcAfter, setCurrentProcAfter] = useState<ProcTypes>("");
  const [contextualLayerUrls, setContextualLayerUrls] = useState<string[]>([]);
  const [basemapKey, setBasemapKey] = useState<undefined | string>();
  const history = useHistory();
  const [filteredAnswers, setFilteredAnswers] = useState<TGetAllAnswers["data"] | null>(null);
  const [lockAlertSelections, setLockAlertSelections] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  let selectedAreaMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId", exact: false });
  let investigationMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId/start", exact: false });
  const isMobile = useMediaQuery({ maxWidth: breakpoints.mobile });
  const [controlsPortal, setControlsPortal] = useState<HTMLElement | undefined>(undefined);
  const { httpAuthHeader } = useAccessToken();
  const { data: layersData } = useGetV3ContextualLayer({ headers: httpAuthHeader });

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

      console.log(values.contextualLayers, layersData);

      setCurrentPlanetPeriod(values.currentPlanetPeriodBefore || "");
      setCurrentProc(values.currentPlanetImageTypeBefore === "nat" ? "" : values.currentPlanetImageTypeBefore || "");
      setCurrentPlanetPeriodAfter(values.currentPlanetPeriodAfter || "");
      setCurrentProcAfter(values.currentPlanetImageTypeAfter === "nat" ? "" : values.currentPlanetImageTypeAfter || "");
      setContextualLayerUrls(
        values.contextualLayers?.map(
          layer => layersData?.data.find(item => item?.id === layer)?.attributes?.url || ""
        ) || []
      );
      setBasemapKey(values.currentMap);
      setIsPlanet(values.showPlanetImagery?.[0] === PLANET_BASEMAP.key);
    });

    return () => subscription.unsubscribe();
  }, [formhook, layersData]);

  useEffect(() => {
    if (!investigationMatch) {
      formhook.reset(defaultValues);
      setShowComparison(false);
    }
  }, [defaultValues, formhook, investigationMatch]);

  useEffect(() => {
    if (!isPlanet) {
      setShowComparison(false);
    }
  }, [isPlanet]);

  const handleFiltersChange = (filters: TGetAllAnswers["data"]) => {
    if (filters?.length === answersBySelectedArea?.length) {
      setFilteredAnswers(null);
    } else {
      setFilteredAnswers(filters);
    }
  };

  const sharedMapProps = useMemo<UserAreasMapProps>(
    () => ({
      onAreaSelect: handleAreaSelect,
      onAreaDeselect: handleAreaDeselect,
      focusAllAreas: !selectedAreaMatch,
      selectedAreaId: selectedAreaMatch?.params.areaId,
      showReports: watcher.layers?.includes(LAYERS.reports) && !!selectedAreaMatch,
      answers: filteredAnswers || answersBySelectedArea,
      mapStyle: mapStyle,
      showTeamAreas: true,
      cooperativeGestures: false,
      shouldWrapContainer: false,
      style: mapContainerStyle,
      uncontrolled: true
    }),
    [
      answersBySelectedArea,
      filteredAnswers,
      handleAreaDeselect,
      handleAreaSelect,
      mapStyle,
      selectedAreaMatch,
      watcher.layers
    ]
  );

  return (
    <>
      <div className="c-map z-auto h-auto" ref={e => setControlsPortal(e || undefined)}></div>
      <MapComparison
        className={classNames("h-full", showComparison && "select-none")}
        minLeftSlide={isMobile ? 300 : 500}
        renderBefore={cb => {
          return (
            <UserAreasMap
              {...sharedMapProps}
              onMapLoad={e => {
                handleMapLoad(e);
                cb(e.target);
              }}
              hideControls={showComparison}
              currentPlanetBasemap={
                basemaps.length && isPlanet
                  ? basemaps.find(bm => bm.name === currentPlanetPeriod) || basemaps[0]
                  : undefined
              }
              currentProc={currentProc}
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
                      onComparison={(value: boolean) => setShowComparison(value)}
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
        renderAfter={
          showComparison
            ? cb => {
                return (
                  <UserAreasMap
                    {...sharedMapProps}
                    onMapLoad={e => {
                      handleMapLoad(e);
                      cb(e.target);
                    }}
                    controlsPortalDom={controlsPortal}
                    currentPlanetBasemap={
                      basemaps.length && isPlanet
                        ? basemaps.find(bm => bm.name === currentPlanetPeriodAfter) || basemaps[0]
                        : undefined
                    }
                    currentProc={currentProcAfter}
                  >
                    <FormProvider {...formhook}>
                      <Layers contextualLayerUrls={contextualLayerUrls} lockAlertSelections={lockAlertSelections} />
                    </FormProvider>
                  </UserAreasMap>
                );
              }
            : undefined
        }
      />
    </>
  );
};

export default InvestigationPage;
