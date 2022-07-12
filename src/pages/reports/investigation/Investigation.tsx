import { FC, useCallback, useState } from "react";
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import AreaDetailsControlPanel, { FormValues, LAYERS } from "./control-panels/AreaDetails";
import AreaListControlPanel from "./control-panels/AreaList";
import { TParams } from "./types";
import { TPropsFromRedux } from "./InvestigationContainer";

interface IProps extends RouteComponentProps, TPropsFromRedux {}

const InvestigationPage: FC<IProps> = props => {
  const { match, allAnswers } = props;
  const [showReports, setShowReports] = useState(true);
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
  };

  return (
    <UserAreasMap
      onAreaSelect={handleAreaSelect}
      onAreaDeselect={handleAreaDeselect}
      focusAllAreas={!selectedAreaMatch}
      selectedAreaId={selectedAreaMatch?.params.areaId}
      showReports={showReports}
      answers={allAnswers}
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
