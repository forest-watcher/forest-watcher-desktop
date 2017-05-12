import { replace } from 'react-router-redux';
import { publicRoutes } from '../constants/routes';

const authRedirectMiddleware = store => next => (action) => {
  const { loggedIn } = store.getState().user;

  if (action.type === 'SET_LOGIN_STATUS') {
    next(action);
  } else if (action.type === '@@router/LOCATION_CHANGE' && !loggedIn && !publicRoutes.includes(action.payload.pathname)) {
    store.dispatch(replace('/'));
  } else {
    next(action);
  }
};

export default authRedirectMiddleware;
