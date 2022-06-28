import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import Invitation from "./Invitation";

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Invitation);
