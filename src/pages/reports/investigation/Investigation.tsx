import { FC } from "react";
import { RouteComponentProps, useRouteMatch } from "react-router-dom";
import UserAreasMap from "components/user-areas-map/UserAreasMap";

interface IProps extends RouteComponentProps {}

const InvestigationPage: FC<IProps> = props => {
  let selectAreaMatch = useRouteMatch({ path: "/reporting/investigation/:areaId", strict: true });
  let startInvestigationMatch = useRouteMatch({ path: "/reporting/investigation/:areaId/start", strict: true });

  console.log(selectAreaMatch, startInvestigationMatch);

  return (
    <UserAreasMap>
      <div>{JSON.stringify(selectAreaMatch)}</div>
      <div>{JSON.stringify(startInvestigationMatch)}</div>
    </UserAreasMap>
  );
};

export default InvestigationPage;
