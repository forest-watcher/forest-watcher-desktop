import { replace } from 'react-router-redux';
import { publicRoutes } from '../constants/routes';

const authRedirectMiddleware = store => next => (action) => {
  next(action);
};

export default authRedirectMiddleware;
