import { connect, ConnectedProps } from "react-redux";
import Reports from "./Reports";
import { RootState } from "store";
import { getAllReports } from "modules/reports";

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = { getAllReports };

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Reports);
