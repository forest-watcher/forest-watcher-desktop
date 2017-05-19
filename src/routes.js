import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

// Pages
// App
import App from './components/app/AppContainer';

const Routes = () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default Routes;
