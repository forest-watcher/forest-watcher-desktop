import { connect } from 'react-redux';
import { getGeoStoresWithAreas } from '../../../modules/areas';

import Areas from './Areas';

const mapStateToProps = ({ areas }) => ({
  areasList: areas.ids,
  loading: areas.loading
});

function mapDispatchToProps(dispatch) {
  return {
    getGeoStoresWithAreas: () => {
      dispatch(getGeoStoresWithAreas());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Areas);
