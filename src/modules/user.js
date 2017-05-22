import { setUserChecked } from './app';
import { API_BASE_URL } from '../constants';
import queryString from 'query-string';

// Actions
const GET_USER = 'user/GET_USER';
const SET_LOGIN_STATUS = 'user/SET_LOGIN_STATUS';
const CHECK_USER_LOGGED = 'user/CHECK_USER_LOGGED';
export const LOGOUT = 'user/LOGOUT';

// Reducer
const initialState = {
  data: {},
  loggedIn: false,
  token: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHECK_USER_LOGGED:
      return Object.assign({}, state, { ...action.payload });
    case GET_USER: {
      if (action.payload.data) {
        const user = action.payload.data.attributes;
        user.id = action.payload.data.id;
        return Object.assign({}, state, { data: user });
      }
      return state;
    }
    case SET_LOGIN_STATUS: {
      return Object.assign({}, state, {
        loggedIn: action.payload.loggedIn,
        token: action.payload.token
      });
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

// Action Creators
export function checkLogged(tokenParam) {
  const url = `${API_BASE_URL}/auth/check-logged`;
  return (dispatch, state) => {
    const user = state().user;
    const queryParams = queryString.parse(tokenParam);
    const token = queryParams.token || user.token;
    const auth = `Bearer ${token}`;
    fetch(url, {
      headers: {
        Authorization: auth
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: CHECK_USER_LOGGED,
          payload: { data, token, loggedIn: true }
        });
        dispatch(setUserChecked());
      })
      .catch((error) => {
        if (user.loggedIn) {
          dispatch({
            type: LOGOUT
          });
        }
        dispatch(setUserChecked());
      });
  };
}

export function setLoginStatus(status) {
  return {
    type: SET_LOGIN_STATUS,
    payload: status
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: LOGOUT
    });
  };
}
