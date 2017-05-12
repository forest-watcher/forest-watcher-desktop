import { connect } from 'react-redux';
import { setLoginStatus, getUser, checkedLogged } from '../../modules/user';
import App from './App';

const mapStateToProps = ({ user }) => ({
  user
});

function mapDispatchToProps(dispatch) {
  return {
    setLoginStatus: (action) => {
      dispatch(setLoginStatus(action));
    },
    getUser: (action) => {
      dispatch(getUser(action));
    },
    checkedLogged: (action) => {
      dispatch(checkedLogged(action));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
