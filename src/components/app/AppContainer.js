import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { checkLogged } from '../../modules/user';
import App from './App';

const mapStateToProps = ({ app, user }) => ({
  user,
  userChecked: app.userChecked
});

function mapDispatchToProps(dispatch) {
  return {
    checkLogged: (token) => {
      dispatch(checkLogged(token));
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
