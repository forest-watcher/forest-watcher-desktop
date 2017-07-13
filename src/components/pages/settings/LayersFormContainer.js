import { connect } from 'react-redux';
import LayersForm from './LayersForm';
import { getGFWLayers, createLayer } from '../../../modules/layers';


const mapStateToProps = ({ layers, teams }) => {
    return { 
      team: teams.data,
      GFWLayers: layers.gfw
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
     getGFWLayers: () => {
       dispatch(getGFWLayers());
     },
    createLayer: (layer, teamId) => {
       dispatch(createLayer(layer, teamId));
     }
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(LayersForm);
