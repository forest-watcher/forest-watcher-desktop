import querystring from 'query-string';
import { setUserChecked } from './app';
import { API_BASE_URL } from '../constants/global';
import { syncApp } from './app';
import { getTeam } from './teams';
import { toastr } from 'react-redux-toastr';

// Actions
const CHECK_USER_LOGGED = 'user/CHECK_USER_LOGGED';
export const LOGOUT = 'user/LOGOUT';
export const SET_USER_DATA = 'user/SET_USER_DATA';

// Reducer
const initialState = {
  data: {
    id: null
  },
  loggedIn: false,
  token: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return { ...state, data: action.payload };
    case CHECK_USER_LOGGED:
      return Object.assign({}, state, { ...action.payload });
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
    const queryParams = querystring.parse(tokenParam);
    const token = queryParams.token || user.token;
    const auth = `Bearer ${token}`;
    fetch(url, {
      headers: {
        Authorization: auth
      }
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then(async (data) => {
        dispatch({
          type: CHECK_USER_LOGGED,
          payload: { data, token, loggedIn: true }
        });
        dispatch(setUserChecked());
        dispatch(syncApp());
      })
      .catch((error) => {
        if (user.loggedIn) {
          dispatch({
            type: LOGOUT
          });
        }
        dispatch(setUserChecked());
        console.warn(error);
      });
  };
}

export function confirmUser(token) {
  const url = `${API_BASE_URL}/teams/confirm/${token}`;
  return (dispatch, state) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then((response) => {
        if (response.ok) return response;
        throw Error(response.statusText);
      })
      .then(async (data) => {
        toastr.success('You have become a confirmed user');
        dispatch(getTeam(state().user.data.id));
      })
      .catch((error) => {
        toastr.error('Error in confirmation');
        console.warn(error);
      });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: LOGOUT
    });
  };
}

export function getUser() {
  const url = `${API_BASE_URL}/user`;
  return (dispatch, state) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then(({ data }) => {
        if (data) {
          dispatch({
            type: SET_USER_DATA,
            payload: { ...data.attributes, id: data.id }
          });
        }
      })
      .catch((error) => {
        toastr.error('Error in user retrieval');
        console.warn(error);
      });
  };
}
