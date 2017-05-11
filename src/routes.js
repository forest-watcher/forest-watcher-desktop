import React from 'react';
import { connect } from 'react-redux';
import { IndexRoute, Router, Route } from 'react-router';

// App
import App from './components/app/App';

const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={App}>
    </Route>
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
