import { connect } from 'react-redux';
import LayersSwitcher from './LayersSwitcher';
import { toggleLayer, getLayers } from '../../../modules/layers';


const mapStateToProps = ({ layers, teams }) => {
  const selectedLayers = layers.selectedLayerIds.map((id) => layers.selectedLayers[id]);
    return { 
      selectedLayers
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
    toggleLayer: (layer, value) => {
       dispatch(toggleLayer(layer, value));
     },
    getLayers: () => {
       dispatch(getLayers());
     }
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(LayersSwitcher);
