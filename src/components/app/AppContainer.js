import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLocale } from '../../modules/app';
import { checkLogged, confirmUser, logout } from '../../modules/user';
import App from './App';
import ReactGA from 'react-ga';
import { GA_UA } from '../../constants/global';

ReactGA.initialize(GA_UA);

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
    confirmUser: (token) => {
      dispatch(confirmUser(token));
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
