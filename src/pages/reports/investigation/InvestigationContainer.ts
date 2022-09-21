import { connect, ConnectedProps } from "react-redux";
import Investigation from "./Investigation";
import { RootState } from "store";

const mapStateToProps = ({ reports, map, areas, layers }: RootState) => ({
  allAnswers: reports.allAnswers,
  basemaps: map.data,
  areas: areas.data,
  areasInUsersTeams: areas.areasInUsersTeams,
  // @ts-ignore
  selectedLayers: layers.selectedLayers
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Investigation);
