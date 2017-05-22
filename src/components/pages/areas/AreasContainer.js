import { connect } from 'react-redux';
import { getUserAreas } from '../../../modules/data';

import Areas from './Areas';

const mapStateToProps = ({ data }) => ({
  data
});

function mapDispatchToProps(dispatch) {
  return {
    getUserAreas: () => {
      dispatch(getUserAreas());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Areas);
