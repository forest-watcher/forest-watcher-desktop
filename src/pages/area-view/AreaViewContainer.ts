import { connect, ConnectedProps } from "react-redux";
import { RootState } from "index";
import { setLoading } from "modules/areas";
import AreaView from "./AreaView";
import { ThunkDispatch } from "redux-thunk";
import { RouteComponentProps } from "react-router-dom";
import { readArea, readGeojson } from "helpers/areas";

interface MatchParams {
  areaId?: string;
}

interface IMatchParams extends RouteComponentProps<MatchParams> {}

const mapStateToProps = (state: RootState, { match }: IMatchParams) => ({
  loading: state.areas.loading,
  geojson: readGeojson(state, match.params.areaId),
  area: readArea(state, match.params.areaId)
});

function mapDispatchToProps(dispatch: ThunkDispatch<RootState, null, any>) {
  return {
    setLoading: (bool: boolean) => {
      dispatch(setLoading(bool));
    }
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AreaView);
