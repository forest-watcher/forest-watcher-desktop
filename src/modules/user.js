import querystring from "query-string";
import { setUserChecked } from "./app";
import { syncApp } from "./app";
import { getTeamByUserId } from "./teams";
import { toastr } from "react-redux-toastr";
import { teamService } from "services/teams";
import { userService } from "services/user";

// Actions
const CHECK_USER_LOGGED = "user/CHECK_USER_LOGGED";
export const LOGOUT = "user/LOGOUT";
export const SET_USER_DATA = "user/SET_USER_DATA";
const SET_FETCHING = "user/SET_FETCHING";

// Reducer
const initialState = {
  data: {
    id: null
  },
  fetching: false,
  loggedIn: false,
  token: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return { ...state, data: action.payload, fetching: false };
    case CHECK_USER_LOGGED:
      return Object.assign({}, state, { fetching: false, ...action.payload });
    case LOGOUT:
      return initialState;
    case SET_FETCHING:
      return { ...state, fetching: true };
    default:
      return state;
  }
}

// Action Creators
export function checkLogged(tokenParam) {
  return (dispatch, state) => {
    const queryParams = querystring.parse(tokenParam);
    const user = state().user;
    const token = queryParams.token || user.token;

    return userService
      .checkLogged(token)
      .then(async data => {
        dispatch({
          type: CHECK_USER_LOGGED,
          payload: { data, token, loggedIn: true }
        });
        dispatch(setUserChecked());
        dispatch(syncApp());
      })
      .catch(error => {
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
  return (dispatch, state) => {
    teamService.token = state().user.token;
    return teamService
      .confirmTeamMember(token)
      .then(async data => {
        toastr.success("You have become a confirmed user");
        dispatch(getTeamByUserId(state().user.data.id));
      })
      .catch(error => {
        toastr.error("Error in confirmation");
        console.warn(error);
      });
  };
}

export function logout() {
  return (dispatch, state) => {
    userService.logout(state().user.token);
    dispatch({
      type: LOGOUT
    });
  };
}

export function getUser() {
  return (dispatch, state) => {
    dispatch({
      type: SET_FETCHING
    });

    return userService
      .getUser()
      .then(({ data }) => {
        if (data) {
          dispatch({
            type: SET_USER_DATA,
            payload: { ...data.attributes, id: data.id }
          });
        }
      })
      .catch(error => {
        toastr.error("Error in user retrieval");
        console.warn(error);
      });
  };
}
