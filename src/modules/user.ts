import querystring from "query-string";
import { setUserChecked } from "./app";
import { syncApp } from "./app";
import { getTeamByUserId } from "./teams";
import { toastr } from "react-redux-toastr";
import { legacy_TeamService } from "services/teams";
import { userService } from "services/user";
import { AppDispatch, RootState } from "store";

// Actions
const CHECK_USER_LOGGED = "user/CHECK_USER_LOGGED";
export const LOGOUT = "user/LOGOUT";
export const SET_USER_DATA = "user/SET_USER_DATA";
const SET_FETCHING = "user/SET_FETCHING";
const SET_USER_TOKEN = "user/SET_USER_TOKEN";

// Reducer
const initialState = {
  data: {
    id: null
  },
  fetching: false,
  loggedIn: false,
  token: null,
  userHasNoLastName: false
};

export type TReducerActions =
  | { type: typeof CHECK_USER_LOGGED; payload: any }
  | { type: typeof LOGOUT; payload: any }
  | { type: typeof SET_USER_DATA; payload: any }
  | { type: typeof SET_FETCHING; payload: any }
  | { type: typeof SET_USER_TOKEN; payload: { token: string } };

export default function reducer(state = initialState, action: TReducerActions) {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        data: action.payload,
        fetching: false,
        // The site requires each user to have a last name
        userHasNoLastName: !action.payload.lastName
      };
    case CHECK_USER_LOGGED:
      return Object.assign({}, state, { fetching: false, ...action.payload });
    case LOGOUT:
      return initialState;
    case SET_FETCHING:
      return { ...state, fetching: true };
    case SET_USER_TOKEN:
      return { ...state, token: action.payload.token };
    default:
      return state;
  }
}

// Action Creators
export function checkLogged(tokenParam: string = "") {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const queryParams = querystring.parse(tokenParam);
    const user = getState().user;
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

export function confirmUser(token: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    legacy_TeamService.token = getState().user.token;
    return legacy_TeamService
      .confirmTeamMember(token)
      .then(async data => {
        toastr.success("You have become a confirmed user", "");
        dispatch(getTeamByUserId(getState().user.data.id));
      })
      .catch(error => {
        toastr.error("Error in confirmation", "");
        console.warn(error);
      });
  };
}

export function logout() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    userService.logout(getState().user.token);
    dispatch({
      type: LOGOUT
    });
  };
}

export function getUser() {
  return (dispatch: AppDispatch) => {
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
        toastr.error("Error in user retrieval", "");
        console.warn(error);
      });
  };
}

export const loginUser = (token: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch({
    type: SET_USER_TOKEN,
    payload: { token }
  });
  dispatch(checkLogged());
};
