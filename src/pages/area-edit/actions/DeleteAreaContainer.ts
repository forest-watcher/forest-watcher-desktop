import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import { deleteArea } from "modules/areas";
import DeleteArea from "./DeleteArea";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = (state: RootState) => ({});

function mapDispatchToProps(dispatch: ThunkDispatch<RootState, null, any>) {
  return {
    deleteArea: async (areaId: string) => {
      return await dispatch(deleteArea(areaId));
    }
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DeleteArea);
