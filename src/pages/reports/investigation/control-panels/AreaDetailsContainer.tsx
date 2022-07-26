import { connect, ConnectedProps } from "react-redux";
import AreaDetails from "./AreaDetails";
import { RootState } from "store";

const mapStateToProps = ({ map }: RootState) => ({
  basemaps: map.data
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AreaDetails);
