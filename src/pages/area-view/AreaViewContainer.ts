import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import { getAreaTeams, setLoading } from "modules/areas";
import AreaView from "./AreaView";
import { ThunkDispatch } from "redux-thunk";
import { getTeamMembers, getUserTeams } from "modules/gfwTeams";

const mapStateToProps = (state: RootState) => ({
  loading: state.areas.loadingAreasInUsers,
  areaTeams: state.areas.areaTeams,
  teams: state.gfwTeams.data,
  teamMembers: state.gfwTeams.members
});

function mapDispatchToProps(dispatch: ThunkDispatch<RootState, null, any>) {
  return {
    setLoading: (bool: boolean) => {
      dispatch(setLoading(bool));
    },
    getUserTeams: (userId: string) => {
      dispatch(getUserTeams(userId));
    },
    getAreaTeams: (areaId: string) => {
      dispatch(getAreaTeams(areaId));
    },
    getTeamMembers: (teamId: string) => {
      dispatch(getTeamMembers(teamId));
    }
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AreaView);
