import { replace } from 'react-router-redux';
import { publicRoutes } from '../constants/routes';

const authRedirectMiddleware = store => next => (action) => {
  // const { loggedIn } = store.getState().user;
  // if (!loggedIn && !publicRoutes.includes(action.payload.pathname)) {
  // } else {
    next(action);
  // }

};

export default authRedirectMiddleware;
