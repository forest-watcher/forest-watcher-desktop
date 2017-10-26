import { connect } from 'react-redux';

import Landing from './Landing';

const mapStateToProps = ({ user }) => ({
  loggedIn: user.loggedIn
});

export default connect(mapStateToProps)(Landing);
