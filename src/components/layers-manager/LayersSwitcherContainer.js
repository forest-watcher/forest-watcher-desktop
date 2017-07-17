import { connect } from 'react-redux';
import LayersSwitcher from './LayersSwitcher';
import { toggleLayer } from '../../modules/layers';

const mapStateToProps = ({ layers, teams }) => {
  const selectedLayers = layers.selectedLayerIds.map((id) => layers.selectedLayers[id]);
  const teamLayers = selectedLayers.filter((selectedLayer) => selectedLayer.attributes && selectedLayer.attributes.owner.type === 'TEAM')
  const userLayers = selectedLayers.filter((selectedLayer) => selectedLayer.attributes && selectedLayer.attributes.owner.type === 'USER');
    return { 
      teamLayers,
      userLayers
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
     toggleLayer: (layer, value) => {
       dispatch(toggleLayer(layer, value));
     }
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(LayersSwitcher);
