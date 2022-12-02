import { connect, ConnectedProps } from "react-redux";
import StartInvestigationControlPanel from "pages/reports/investigation/control-panels/start-investigation/StartInvestigation";
import { RootState } from "store";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>) => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(StartInvestigationControlPanel);
