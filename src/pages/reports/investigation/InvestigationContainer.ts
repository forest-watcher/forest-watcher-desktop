import { connect, ConnectedProps } from "react-redux";
import Investigation from "./Investigation";
import { RootState } from "store";

const mapStateToProps = ({ reports }: RootState) => ({
  allAnswers: reports.allAnswers
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Investigation);
