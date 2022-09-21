import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import Teams from "./Teams";
import { getUserTeams, getMyTeamInvites } from "modules/gfwTeams";

const mapStateToProps = ({ gfwTeams, areas }: RootState) => ({
  teams: gfwTeams.data,
  myInvites: gfwTeams.myInvites,
  numOfActiveFetches: gfwTeams.numOfActiveFetches,
  isLoading: areas.loadingAreasInUsers || gfwTeams.numOfActiveFetches > 0
});

const mapDispatchToProps = {
  getUserTeams,
  getMyTeamInvites
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Teams);
