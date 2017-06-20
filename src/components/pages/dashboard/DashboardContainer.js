import { connect } from 'react-redux';
import { getUserTemplates, getUserQuestionares } from '../../../modules/reports';
import { getUserAreas } from '../../../modules/areas';

import Dashboard from './Dashboard';

const mapStateToProps = ({ data }) => ({
  data
});

function mapDispatchToProps(dispatch) {
  return {
    getUserAreas: () => {
      dispatch(getUserAreas());
    },
    getUserTemplates: () => {
      dispatch(getUserTemplates());
    },
    getUserQuestionares: () => {
      dispatch(getUserQuestionares());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
