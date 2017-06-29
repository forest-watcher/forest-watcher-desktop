import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLocale } from '../../modules/app';
import { checkLogged, logout } from '../../modules/user';
import App from './App';

const mapStateToProps = ({ app, user }) => ({
  user,
  userChecked: app.userChecked,
  locale: app.locale
});

function mapDispatchToProps(dispatch) {
  return {
    checkLogged: (token) => {
      dispatch(checkLogged(token));
    },
    logout: () => {
      dispatch(logout());
    },
    setLocale: (language) => {
      dispatch(setLocale(language));
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
