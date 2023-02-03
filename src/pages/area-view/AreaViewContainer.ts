import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import { getAreaTeams, setLoading } from "modules/areas";
import AreaView from "./AreaView";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = (state: RootState) => ({
  loading: state.areas.loadingAreasInUsers,
  areaTeams: state.areas.areaTeams
});

function mapDispatchToProps(dispatch: ThunkDispatch<RootState, null, any>) {
  return {
    setLoading: (bool: boolean) => {
      dispatch(setLoading(bool));
    },
    getAreaTeams: (areaId: string) => {
      dispatch(getAreaTeams(areaId));
    }
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AreaView);
