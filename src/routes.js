import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom'
import fireTracking from 'helpers/analytics';

// App
import App from './components/app/AppContainer';

const Routes = () => (
  <Router onUpdate={fireTracking}>
    <App />
  </Router>
);

export default Routes;
