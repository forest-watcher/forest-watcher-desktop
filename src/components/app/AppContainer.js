import { connect } from 'react-redux';
import { setLoginStatus, getUser, checkLogged } from '../../modules/user';
import App from './App';

const mapStateToProps = ({ app, user }) => ({
  user,
  userChecked: app.userChecked
});

function mapDispatchToProps(dispatch) {
  return {
    setLoginStatus: (action) => {
      dispatch(setLoginStatus(action));
    },
    getUser: (action) => {
      dispatch(getUser(action));
    },
    checkLogged: (token) => {
      dispatch(checkLogged(token));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
