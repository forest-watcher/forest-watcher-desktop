import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import { saveAreaWithGeostore, setSaving, setLoading, saveArea } from "modules/areas";
import { getGeoFromShape } from "modules/geostores";
import AreaEdit from "./AreaEdit";
import { ThunkDispatch } from "redux-thunk";
import { RouteComponentProps } from "react-router-dom";

export interface MatchParams {
  areaId?: string;
}

interface IMatchParams extends RouteComponentProps<MatchParams> {}

const mapStateToProps = (state: RootState, { match }: IMatchParams) => ({
  mode: match.params.areaId ? "manage" : "create",
  editing: state.areas.editing,
  saving: state.areas.saving
});

function mapDispatchToProps(dispatch: ThunkDispatch<RootState, null, any>) {
  return {
    getGeoFromShape: async (area: any) => {
      return await dispatch(getGeoFromShape(area));
    },
    saveAreaWithGeostore: async (area: any, node: HTMLCanvasElement, method: string) => {
      return await dispatch(saveAreaWithGeostore(area, node, method));
    },
    saveArea: async (area: any, node: HTMLCanvasElement, method: string) => {
      return await dispatch(saveArea(area, node, method));
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
