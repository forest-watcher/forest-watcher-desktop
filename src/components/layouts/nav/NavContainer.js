import { connect } from 'react-redux';
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

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
