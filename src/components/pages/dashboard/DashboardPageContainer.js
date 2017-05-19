import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { getUserAreas, getUserReports, getUserQuestionares } from '../../../modules/data';

import DashboardPage from './DashboardPage';

const mapStateToProps = ({ data }) => ({
  data
});

function mapDispatchToProps(dispatch) {
  return {
    getUserAreas: () => {
      dispatch(getUserAreas());
    },
    getUserReports: () => {
      dispatch(getUserReports());
    },
    getUserQuestionares: () => {
      dispatch(getUserQuestionares());
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardPage));
