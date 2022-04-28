import { toastr } from "react-redux-toastr";
import { Team, teamService } from "services/teams";
// Actions
const GET_TEAM = "teams/GET_TEAM";
const SAVE_TEAM = "teams/SAVE_TEAM";
const SET_EDITING = "teams/SET_EDITING";
const SET_LOADING = "teams/SET_LOADING";
const SET_SAVING = "teams/SET_SAVING";
const SEND_NOTIFICATIONS = "teams/SEND_NOTIFICATIONS";

// Reducer
const initialState = {
  data: null,
  sendNotifications: false,
  editing: false,
  loading: true,
  saving: false,
  teams: {}
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case GET_TEAM: {
      const team = action.payload;
      if (team) {
        return Object.assign({}, state, { data: team });
      }
      return state;
    }
    case SAVE_TEAM: {
      const team = action.payload.team;
      return {
        ...state,
        teams: { ...state.teams, ...team }
      };
    }
    case SET_EDITING: {
      return Object.assign({}, state, { editing: action.payload });
    }
    case SET_LOADING: {
      return Object.assign({}, state, { loading: action.payload });
    }
    case SET_SAVING: {
      return Object.assign({}, state, { saving: action.payload });
    }
    case SEND_NOTIFICATIONS: {
      return Object.assign({}, state, { sendNotifications: action.payload });
    }
    default:
      return state;
  }
}

// Action Creators

export function getTeamByUserId(userId: string) {
  return (dispatch: any, state: any) => {
    teamService.token = state().user.token;
    return teamService
      .getTeamByUserId(userId)
      .then(response => {
        const team = response.data;
        dispatch({
          type: GET_TEAM,
          payload: team
        });
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        return team;
      })
      .catch(error => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        console.warn("error", error);
      });
  };
}

export function createTeam(team: Team) {
  return (dispatch: any, state: any) => {
    dispatch({
      type: SET_SAVING,
      payload: true
    });
    return teamService
      .saveTeam(team, state().app.locale)
      .then(response => {
        const team = response.data;
        dispatch({
          type: SAVE_TEAM,
          payload: team
        });
        dispatch({
          type: SET_SAVING,
          payload: false
        });
        dispatch(getTeamByUserId(state().user.data.id));
        if (state().teams.sendNotifications) {
          toastr.success("Request sent", "");
          dispatch({
            type: SEND_NOTIFICATIONS,
            payload: false
          });
        }
        return team;
      })
      .catch(error => {
        dispatch({
          type: SET_SAVING,
          payload: false
        });
        console.warn("error", error);
      });
  };
}

export function updateTeam(team: Team, id: string) {
  return (dispatch: any, state: any) => {
    dispatch({
      type: SET_SAVING,
      payload: true
    });
    return teamService
      .saveTeam(team, state().app.locale, id)
      .then(response => {
        const team = response.data;
        dispatch({
          type: SAVE_TEAM,
          payload: team
        });
        dispatch({
          type: SET_SAVING,
          payload: false
        });
        dispatch(getTeamByUserId(state().user.data.id));
        dispatch({
          type: SET_EDITING,
          payload: false
        });
        if (state().teams.sendNotifications) {
          toastr.success("Request sent", "");
          dispatch({
            type: SEND_NOTIFICATIONS,
            payload: false
          });
        }
        return team;
      })
      .catch(error => {
        dispatch({
          type: SET_SAVING,
          payload: false
        });
        console.warn("error", error);
      });
  };
}

export function setEditing(value: boolean) {
  return {
    type: SET_EDITING,
    payload: value
  };
}

export function setLoading(value: boolean) {
  return {
    type: SET_LOADING,
    payload: value
  };
}

export function setSaving(value: boolean) {
  return {
    type: SET_SAVING,
    payload: value
  };
}

export function sendNotifications() {
  return {
    type: SEND_NOTIFICATIONS,
    payload: true
  };
}
