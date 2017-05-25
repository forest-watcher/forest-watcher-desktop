import { connect } from 'react-redux';
import { getUserReports } from '../../../modules/reports';

import Reports from './Reports';

const mapStateToProps = ({ reports }) => ({
  reportsList: reports.ids,
  loading: reports.loading
});

function mapDispatchToProps(dispatch) {
  return {
    getUserReports: () => {
      dispatch(getUserReports());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
