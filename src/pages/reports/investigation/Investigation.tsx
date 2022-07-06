import { FC, useCallback } from "react";
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import AreaDetailsControlPanel from "./control-panels/AreaDetails";
import AreaListControlPanel from "./control-panels/AreaList";
import { TParams } from "./types";

interface IProps extends RouteComponentProps {}

const InvestigationPage: FC<IProps> = props => {
  const { match } = props;
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

  return (
    <UserAreasMap
      onAreaSelect={handleAreaSelect}
      onAreaDeselect={handleAreaDeselect}
      focusAllAreas={!selectedAreaMatch}
      selectedAreaId={selectedAreaMatch?.params.areaId}
    >
      <Switch>
        <Route exact path={`${match.url}`} component={AreaListControlPanel} />
        <Route exact path={`${match.url}/:areaId`} component={AreaDetailsControlPanel} />
      </Switch>
    </UserAreasMap>
  );
};

export default InvestigationPage;
