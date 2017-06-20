import { connect } from 'react-redux';
import { getUserReports } from '../../../modules/reports';

import Templates from './Templates';

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

export default connect(mapStateToProps, mapDispatchToProps)(Templates);
