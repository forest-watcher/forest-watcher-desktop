import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom'

// App
import App from './components/app/AppContainer';

const Routes = () => (
  <Router>
    <App />
  </Router>
);

export default Routes;
