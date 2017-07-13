import { connect } from 'react-redux';
import LayersManager from './LayersManager';
import { getLayers, toggleLayer } from '../../../modules/layers';


const mapStateToProps = ({ layers, teams }) => {
  const selectedLayers = layers.selectedLayerIds.map((id) => layers.selectedLayers[id]);
    return { 
      team: teams.data,
      selectedLayers
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
     getLayers: () => {
       dispatch(getLayers());
     },
    toggleLayer: (layer, value) => {
       dispatch(toggleLayer(layer, value));
     }
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(LayersManager);
