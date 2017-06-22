import { connect } from 'react-redux';
import { saveAreaWithGeostore } from '../../../modules/areas';

import AreasManage from './AreasManage';

const mapStateToProps = ({ areas }) => ({
  areasList: areas.ids,
  loading: areas.loading
});

function mapDispatchToProps(dispatch) {
  return {
    saveAreaWithGeostore: (area) => {
      dispatch(saveAreaWithGeostore(area));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AreasManage);
