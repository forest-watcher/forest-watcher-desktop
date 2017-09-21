import { connect } from 'react-redux';
import { getLayers } from '../../modules/layers';
import capitalize from 'lodash/capitalize';
import LayersSelector from './LayersSelector';

const mapStateToProps = (state) => {
  const layers = Object.values(state.layers.selectedLayers)
    .filter(layer => (layer.attributes && layer.attributes.isPublic));
  const layersOptions = layers.map(layer => ({
    option: layer.id,
    label: capitalize(layer.attributes.name)
  }));

  return {
    layers: layers,
    layersOptions
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getLayers: () => {
      dispatch(getLayers());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LayersSelector);
