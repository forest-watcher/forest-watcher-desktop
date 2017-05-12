import { replace } from 'react-router-redux';

// Actions
const GET_USER = 'GET_USER';
const SET_LOGIN_MODAL = 'SET_LOGIN_MODAL';
const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS';
const CHECK_USER_LOGGED = 'CHECK_USER_LOGGED';
export const LOGOUT = 'LOGOUT';

// Reducer
const initialState = {
  data: {},
  loggedIn: false,
  token: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHECK_USER_LOGGED:
      return Object.assign({}, state, { data: action.payload });
    case GET_USER: {
      if (action.payload.data) {
        const user = action.payload.data.attributes;
        user.id = action.payload.data.id;
        return Object.assign({}, state, { data: user });
      }
      return state;
    }
    case SET_LOGIN_STATUS:
      return Object.assign({}, state, {
        loggedIn: action.payload.loggedIn,
        token: action.payload.token
      });
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

// Action Creators
export function checkLogged() {
  const url = `${process.env.REACT_APP_API_AUTH}/auth/check-logged`;
  return (dispatch, state) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: CHECK_USER_LOGGED,
          payload: data
        });
      })
      .catch((error) => {
        console.info(error);
        // To-do
      });
  };
}

export function getUser() {
  const url = `${process.env.REACT_APP_API_AUTH}/user`;
  return (dispatch, state) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_USER,
          payload: data
        });
      })
      .catch((error) => {
        console.info(error);
        // To-do
      });
  };
}

export function setLoginStatus(status) {
  return (dispatch) => {
    dispatch({
      type: SET_LOGIN_STATUS,
      payload: status
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
