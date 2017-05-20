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
    <App />
  </Router>
);

export default Routes;
