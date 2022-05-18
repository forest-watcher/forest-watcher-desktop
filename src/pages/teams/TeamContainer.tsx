import { connect } from "react-redux";
import { RootState, AppDispatch } from "index";
import Teams from "./Teams";

const mapStateToProps = (store: RootState) => ({});

const mapDispatchToProps = (dispatch: AppDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
