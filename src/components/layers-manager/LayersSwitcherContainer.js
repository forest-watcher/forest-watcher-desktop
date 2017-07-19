import { connect } from 'react-redux';
import LayersSwitcher from './LayersSwitcher';
import { toggleLayer, deleteLayer } from '../../modules/layers';

const mapStateToProps = () => {
    return {};
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
