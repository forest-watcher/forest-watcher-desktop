import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../../../modules/user';

import Nav from './Nav';

const mapStateToProps = ({ user }) => ({
  user
});

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch(logout());
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav));
