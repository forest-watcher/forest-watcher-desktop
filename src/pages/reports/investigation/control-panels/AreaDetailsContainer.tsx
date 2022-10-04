import { connect, ConnectedProps } from "react-redux";
import AreaDetails from "./AreaDetails";
import { RootState } from "store";
import { getLayers } from "modules/layers";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = ({ map, templates, layers }: RootState) => {
  // @ts-ignore
  const layersOptions = Object.values(layers.selectedLayers)
    // @ts-ignore
    .filter(layer => layer.attributes.enabled)
    .map(layer => ({
      // @ts-ignore
      option: layer.id,
      // @ts-ignore
      label: layer.attributes.name
    }));

  return {
    basemaps: map.data,
    templates: templates.templates,
    layersOptions
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>) => ({
  getLayers: () => dispatch(getLayers())
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AreaDetails);
