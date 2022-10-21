import OptionalWrapper from "components/extensive/OptionalWrapper";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import { LAYERS } from "pages/reports/investigation/control-panels/start-investigation/StartInvestigation";
import { TParams } from "./types";
import { TPropsFromRedux } from "./InvestigationContainer";
import { BASEMAPS } from "constants/mapbox";
import { TGetAllAnswers } from "services/reports";
import { Layer, Source } from "react-map-gl";
import { setupMapImages } from "helpers/map";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";

// Control Panel Views
import AreaListControlPanel from "./control-panels/AreaList";
import AreaDetailControlPanel from "pages/reports/investigation/control-panels/AreaDetail";
import StartInvestigationControlPanel from "pages/reports/investigation/control-panels/start-investigation/StartInvestigationContainer";
import AddAssignmentControlPanel from "pages/reports/investigation/control-panels/AddAssignment/AddAssignment";

interface IProps extends RouteComponentProps, TPropsFromRedux {}

export type TFormValues = {
  layers?: string[];
  currentMap?: string;
  currentPlanetPeriod?: string;
  currentPlanetImageType?: "nat" | "cir";
  contextualLayers?: string[];
  showAlerts: ["true"];
  showOpenAssignments: ["true"];
  alertTypesShown?: string;
  alertTypesTimeframes?: string;
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
      showAlerts: ["true"],
      showOpenAssignments: ["true"]
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
        setIsPlanet(values.currentMap === BASEMAPS.planet.key);
      }

      setCurrentPlanetPeriod(values.currentPlanetPeriod || "");
      setCurrentProc(values.currentPlanetImageType === "nat" ? "" : values.currentPlanetImageType || "");
      setContextualLayerUrls(values.contextualLayers?.map(layer => selectedLayers[layer].attributes.url) || []);
      setBasemapKey(values.currentMap);
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
    <UserAreasMap
      onAreaSelect={handleAreaSelect}
      onAreaDeselect={handleAreaDeselect}
      onMapLoad={handleMapLoad}
      focusAllAreas={!selectedAreaMatch}
      selectedAreaId={selectedAreaMatch?.params.areaId}
      showReports={watcher.layers?.includes(LAYERS.reports) && !!selectedAreaMatch}
      answers={filteredAnswers || answersBySelectedArea}
      mapStyle={mapStyle}
      currentPlanetBasemap={
        basemaps.length && isPlanet ? basemaps.find(bm => bm.name === currentPlanetPeriod) || basemaps[0] : undefined
      }
      currentProc={currentProc}
      showTeamAreas
      cooperativeGestures={false}
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
            <AddAssignmentControlPanel />
          </Route>
        </Switch>

        <OptionalWrapper data={!!investigationMatch}>
          {contextualLayerUrls.map(url => (
            <Source id={url} type="raster" tiles={[url]} key={url}>
              <Layer id={`${url}-layer`} type="raster" />
            </Source>
          ))}

          {watcher.showAlerts.includes("true") && (
            <div className="u-visually-hidden">ToDo: Render 'Alerts' map Source component</div>
          )}

          {watcher.showOpenAssignments.includes("true") && (
            <div className="u-visually-hidden">ToDo: Render 'Open Assignments' map Source component</div>
          )}
        </OptionalWrapper>
      </FormProvider>
    </UserAreasMap>
  );
};

export default InvestigationPage;
