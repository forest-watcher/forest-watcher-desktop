import { connect } from 'react-redux';
import LayersShow from './LayersShow';

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

 function mapDispatchToProps() {
   return {}
 }

export default connect(mapStateToProps, mapDispatchToProps)(LayersShow);
