import { connect } from 'react-redux';
import { getUserAreas, getUserReports, getUserQuestionares } from '../../../modules/data';

import Dashboard from './Dashboard';

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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
