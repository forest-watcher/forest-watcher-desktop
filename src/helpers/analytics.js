import ReactGA from 'react-ga';

ReactGA.initialize('UA-48182293-4'); //Unique Google Analytics tracking number

const fireTracking = () => {
  ReactGA.pageview(window.location.hash);
}

export { fireTracking };
