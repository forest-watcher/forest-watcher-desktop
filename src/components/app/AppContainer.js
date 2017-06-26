import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { checkLogged, logout } from '../../modules/user';
import App from './App';

const mapStateToProps = ({ app, user }) => ({
  user,
  userChecked: app.userChecked
});

function mapDispatchToProps(dispatch) {
  return {
    checkLogged: (token) => {
      dispatch(checkLogged(token));
    },
    logout: () => {
      dispatch(logout());
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
