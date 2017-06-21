import { connect } from 'react-redux';
import { postArea } from '../../../modules/areas';

import AreasManage from './AreasManage';

const mapStateToProps = ({ areas }) => ({
  areasList: areas.ids,
  loading: areas.loading
});

function mapDispatchToProps(dispatch) {
  return {
    postArea: (area) => {
      dispatch(postArea(area));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AreasManage);
