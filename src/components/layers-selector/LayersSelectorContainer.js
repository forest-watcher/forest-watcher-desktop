import { connect } from 'react-redux';
import { getLayers } from '../../modules/layers';
import capitalize from 'lodash/capitalize';
import LayersSelector from './LayersSelector';

const mapStateToProps = (state) => {
  const layersOptions = Object.values(state.layers.selectedLayers).map(layer => ({
    option: layer.id,
    label: capitalize(layer.attributes.name)
  }));

  return {
    layersOptions,
    layers: state.layers.selectedLayers
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
