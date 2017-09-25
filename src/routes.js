import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom'

import ReactGA from 'react-ga';
ReactGA.initialize('UA-48182293-4'); //Unique Google Analytics tracking number

// App
import App from './components/app/AppContainer';

const fireTracking = () => {
  ReactGA.pageview(window.location.hash);
}

const Routes = () => (
  <Router onUpdate={fireTracking}>
    <App />
  </Router>
);

export default Routes;
