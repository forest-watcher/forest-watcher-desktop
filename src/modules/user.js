import querystring from 'query-string';
import { setUserChecked } from './app';
import { API_BASE_URL } from '../constants/global';
import { syncApp } from './app';
import { getTeam } from './teams';
import { toastr } from 'react-redux-toastr';

// Actions
const GET_USER = 'user/GET_USER';
const CHECK_USER_LOGGED = 'user/CHECK_USER_LOGGED';
const GET_USER_EMAIL = 'user/GET_USER_EMAIL';
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
    case GET_USER_EMAIL: {
      const user = state.data;
      user.email = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          email: user.email
        }
      }
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

export function getUserEmail() {
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
      .then(async (res) => {
        const user = res.data;
        dispatch({
          type: GET_USER_EMAIL,
          payload: user && user.attributes.email
        });

      })
      .catch((error) => {
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
