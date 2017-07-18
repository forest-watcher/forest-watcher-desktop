import { connect } from 'react-redux';
import LayersForm from './LayersForm';
import { createLayer } from '../../modules/layers';


const mapStateToProps = ({ layers, teams }) => {
    return { 
      team: teams.data,
      GFWLayers: layers.gfw
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
    createLayer: (layer, teamId) => {
       dispatch(createLayer(layer, teamId));
     }
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(LayersForm);
