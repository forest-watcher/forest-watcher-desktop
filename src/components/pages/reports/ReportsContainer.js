import { connect } from 'react-redux';
import { getUserReports } from '../../../modules/data';

import Reports from './Reports';

const mapStateToProps = ({ data }) => ({
  data
});

function mapDispatchToProps(dispatch) {
  return {
    getUserReports: () => {
      dispatch(getUserReports());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
