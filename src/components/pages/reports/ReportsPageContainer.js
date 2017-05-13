import { connect } from 'react-redux';
import { getUserReports } from '../../../modules/data';

import ReportsPage from './ReportsPage';

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

export default connect(mapStateToProps, mapDispatchToProps)(ReportsPage);
