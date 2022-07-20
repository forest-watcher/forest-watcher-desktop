import { connect, ConnectedProps } from "react-redux";
import Investigation from "./Investigation";
import { RootState } from "store";

const mapStateToProps = ({ reports, map }: RootState) => ({
  allAnswers: reports.allAnswers,
  basemaps: map.data
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Investigation);
