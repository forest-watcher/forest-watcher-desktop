import { connect } from 'react-redux';
import { saveGeostore } from '../../../modules/geostores';

import AreasManage from './AreasManage';

const mapStateToProps = ({ areas }) => ({
  areasList: areas.ids,
  loading: areas.loading
});

function mapDispatchToProps(dispatch) {
  return {
    saveGeostore: (geojson) => {
      dispatch(saveGeostore(geojson));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AreasManage);
