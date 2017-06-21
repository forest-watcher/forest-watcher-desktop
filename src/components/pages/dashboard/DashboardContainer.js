import { connect } from 'react-redux';
import { getUserReports, getUserQuestionares } from '../../../modules/data';
import { getAreas } from '../../../modules/areas';

import Dashboard from './Dashboard';

const mapStateToProps = ({ data }) => ({
  data
});

function mapDispatchToProps(dispatch) {
  return {
    getAreas: () => {
      dispatch(getAreas());
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
