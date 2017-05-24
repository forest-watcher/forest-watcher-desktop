import { connect } from 'react-redux';
import { getUserAreas } from '../../../modules/areas';

import Areas from './Areas';

const mapStateToProps = ({ areas }) => ({
  areasList: areas.ids
});

function mapDispatchToProps(dispatch) {
  return {
    getUserAreas: () => {
      dispatch(getUserAreas());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Areas);
