import React from 'react';
import { connect } from 'react-redux';
import { IndexRoute, Router, Route } from 'react-router';

// App
import App from './components/app/AppContainer';

// Pages
import LoginPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/dashboard/DashboardPage';


const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute components={{ main: LoginPage }} />
      <Route path="dashboard">
        <IndexRoute components={{ main: DashboardPage }} />
      </Route>
    </Route>
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
