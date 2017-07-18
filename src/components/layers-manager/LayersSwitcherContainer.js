import { connect } from 'react-redux';
import LayersSwitcher from './LayersSwitcher';
import { toggleLayer, deleteLayer } from '../../modules/layers';

const mapStateToProps = ({ layers, teams }) => {
  const selectedLayers = layers.selectedLayerIds.map((id) => layers.selectedLayers[id]);
  const publicLayers = selectedLayers.filter((selectedLayer) => selectedLayer.attributes && selectedLayer.attributes.isPublic);
  const teamLayers = selectedLayers.filter((selectedLayer) => 
      selectedLayer.attributes && !selectedLayer.attributes.isPublic && selectedLayer.attributes.owner.type === 'TEAM'
    )
  const userLayers = selectedLayers.filter((selectedLayer) => 
    selectedLayer.attributes && !selectedLayer.attributes.isPublic && selectedLayer.attributes.owner.type === 'USER'
  );
    return { 
      publicLayers,
      teamLayers,
      userLayers
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
     toggleLayer: (layer, value) => {
       dispatch(toggleLayer(layer, value));
     },
     deleteLayer: (layer) => {
       dispatch(deleteLayer(layer));
     }
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(LayersSwitcher);
