import { FC, useCallback, useState } from "react";
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import AreaDetailsControlPanel from "./control-panels/AreaDetailsContainer";
import { FormValues, LAYERS } from "./control-panels/AreaDetails";
import AreaListControlPanel from "./control-panels/AreaList";
import { TParams } from "./types";
import { TPropsFromRedux } from "./InvestigationContainer";
import { BASEMAPS } from "constants/mapbox";

interface IProps extends RouteComponentProps, TPropsFromRedux {}

const InvestigationPage: FC<IProps> = props => {
  const { match, allAnswers, basemaps } = props;
  const [showReports, setShowReports] = useState(true);
  const [mapStyle, setMapStyle] = useState<string | undefined>(undefined);
  const [isPlanet, setIsPlanet] = useState(false);
  const [currentPlanetPeriod, setCurrentPlanetPeriod] = useState("");
  const [currentProc, setCurrentProc] = useState<"" | "cir">("");
  const history = useHistory();
  let selectedAreaMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId", exact: true });

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
  };

  return (
    <UserAreasMap
      onAreaSelect={handleAreaSelect}
      onAreaDeselect={handleAreaDeselect}
      focusAllAreas={!selectedAreaMatch}
      selectedAreaId={selectedAreaMatch?.params.areaId}
      showReports={showReports}
      answers={allAnswers}
      mapStyle={mapStyle}
      currentPlanetBasemap={
        basemaps.length && isPlanet ? basemaps.find(bm => bm.name === currentPlanetPeriod) || basemaps[0] : undefined
      }
      currentProc={currentProc}
    >
      <Switch>
        <Route exact path={`${match.url}`} component={AreaListControlPanel} />
        <Route exact path={`${match.url}/:areaId`}>
          <AreaDetailsControlPanel onChange={handleControlPanelChange} />
        </Route>
      </Switch>
    </UserAreasMap>
  );
};

export default InvestigationPage;
