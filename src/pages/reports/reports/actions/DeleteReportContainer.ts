import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
// import { deleteReport } from "modules/reports";
import DeleteReport from "./DeleteReport";
import { getAllReports } from "modules/reports";

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = { getAllReports };

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DeleteReport);
