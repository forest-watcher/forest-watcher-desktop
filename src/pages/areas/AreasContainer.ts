import { getTeamMembers } from "modules/gfwTeams";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "store";

import Areas from "./Areas";

const mapStateToProps = ({ areas, app, gfwTeams }: RootState) => ({
  areasList: areas.data,
  areasInUsersTeams: areas.areasInUsersTeams,
  loading: areas.loading,
  userChecked: app.userChecked,
  loadingTeamAreas: areas.loadingAreasInUsers,
  teamMembers: gfwTeams.members
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>) => ({
  getTeamMembers: (teamId: string) => dispatch(getTeamMembers(teamId))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Areas);
