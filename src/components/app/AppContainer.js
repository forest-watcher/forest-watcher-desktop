import { connect } from 'react-redux';
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
