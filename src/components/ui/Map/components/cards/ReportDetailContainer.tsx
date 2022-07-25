import { connect, ConnectedProps } from "react-redux";
import ReportDetail from "./ReportDetail";
import { RootState } from "store";

const mapStateToProps = (state: RootState) => ({
  areasInUsersTeams: state.areas.areasInUsersTeams
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ReportDetail);
