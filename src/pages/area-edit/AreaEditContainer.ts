import { connect, ConnectedProps } from "react-redux";
import { RootState } from "index";
import { saveAreaWithGeostore, setSaving, setLoading } from "modules/areas";
import { getGeoFromShape } from "modules/geostores";
import AreaEdit from "./AreaEdit";
import { ThunkDispatch } from "redux-thunk";
import { RouteComponentProps } from "react-router-dom";
import { readArea, readGeojson } from "helpers/areas";

interface MatchParams {
  areaId?: string;
}

interface IMatchParams extends RouteComponentProps<MatchParams> {}

const mapStateToProps = (state: RootState, { match }: IMatchParams) => ({
  mode: match.params.areaId ? "manage" : "create",
  loading: state.areas.loading,
  editing: state.areas.editing,
  saving: state.areas.saving,
  geojson: readGeojson(state, match.params.areaId),
  area: readArea(state, match.params.areaId)
});

function mapDispatchToProps(dispatch: ThunkDispatch<RootState, null, any>) {
  return {
    getGeoFromShape: async (area: any) => {
      return await dispatch(getGeoFromShape(area));
    },
    saveAreaWithGeostore: (area: any, node: HTMLElement, method: string) => {
      dispatch(saveAreaWithGeostore(area, node, method));
    },
    setSaving: (bool: boolean) => {
      dispatch(setSaving(bool));
    },
    setLoading: (bool: boolean) => {
      dispatch(setLoading(bool));
    }
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AreaEdit);
