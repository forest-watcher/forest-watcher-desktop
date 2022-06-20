import { getAreasInUsersTeams } from "modules/areas";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";

import Areas from "./Areas";

const mapStateToProps = ({ areas, app }: RootState) => ({
  areasList: areas.data,
  areasInUsersTeams: areas.areasInUsersTeams,
  loading: areas.loading,
  userChecked: app.userChecked,
  loadingTeamAreas: areas.loadingAreasInUsers
});

const mapDispatchToProps = {
  getAreasInUsersTeams
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Areas);
