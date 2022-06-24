import { FC } from "react";
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

  const handleAreaClick = (areaId: string) => {
    history.push(`${match.url}/${areaId}`);
  };

  return (
    <UserAreasMap
      onAreaClick={handleAreaClick}
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
