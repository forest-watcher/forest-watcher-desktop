import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";

import Areas from "./Areas";

const mapStateToProps = ({ areas, app, reports }: RootState) => ({
  areasList: areas.data,
  areasInUsersTeams: areas.areasInUsersTeams,
  allAnswers: reports.allAnswers,
  loading: areas.loading,
  userChecked: app.userChecked,
  loadingTeamAreas: areas.loadingAreasInUsers
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Areas);
