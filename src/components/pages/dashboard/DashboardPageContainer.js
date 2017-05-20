import { connect } from 'react-redux';
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
