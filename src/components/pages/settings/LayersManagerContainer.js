import { connect } from 'react-redux';
import LayersManager from './LayersManager';
import { getLayers } from '../../../modules/layers';


const mapStateToProps = ({ layers }) => {
    return { 
      gfwLayers: layers.gfw
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
     getLayers: () => {
       dispatch(getLayers());
     }
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(LayersManager);
