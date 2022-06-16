import { connect, ConnectedProps } from "react-redux";
import Reports from "./Reports";
import { RootState } from "store";

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Reports);
