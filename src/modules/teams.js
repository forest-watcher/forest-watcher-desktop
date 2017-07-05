import { API_DEV_BASE_URL, AUTH_DEV_TOKEN } from '../constants/global'
import { unique } from '../helpers/utils';
import { toastr } from 'react-redux-toastr';

// Actions
const GET_TEAM = 'teams/GET_TEAM';
const SAVE_TEAM = 'teams/SAVE_TEAM';
const SET_EDITING = 'teams/SET_EDITING';
const SEND_NOTIFICATIONS = 'teams/SEND_NOTIFICATIONS'

// Reducer
const initialState = {
  data: null,
  sendNotifications: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_TEAM: {
      const team = action.payload;
      if (team) return Object.assign({}, state, { data: team });
      return state;
    }
    case SAVE_TEAM: {
      const team = action.payload.team;
      return {
        ...state,
        teams: { ...state.teams, ...team }
      };
    }
    case SET_EDITING:{
      return Object.assign({}, state, { editing: action.payload });
    }
    case SEND_NOTIFICATIONS:{
      return Object.assign({}, state, { sendNotifications: action.payload });
    }
    default:
      return state;
  }
}

// Action Creators

export function getTeam(userId) {
  const url = `${API_DEV_BASE_URL}/teams/user/${userId}`;
  // Authorization: `Bearer ${state().user.token}`
  return (dispatch, state) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTH_DEV_TOKEN}`
      }
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((response) => {
        const team = response.data;
        dispatch({
          type: GET_TEAM,
          payload: team
        });
        return team;
      })
      .catch((error) => {
        console.warn('error', error)
      });
  };
}

const getBody = (team) => {
  // Managers are always users
  const users = team.users.concat(team.managers).filter(unique);
  return JSON.stringify({
    name: team.name,
    managers: team.managers.filter(unique),
    users,
    areas: team.areas
  })
}

export function createTeam(team) {
  const url = `${API_DEV_BASE_URL}/teams/`;
  // Authorization: `Bearer ${state().user.token}`
  return (dispatch, state) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTH_DEV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: getBody(team)
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((response) => {
        const team = response.data;
        dispatch({
          type: SAVE_TEAM,
          payload: team
        });
        dispatch(getTeam(state().user.id));
        dispatch({
          type: SET_EDITING,
          payload: false
        });
        if (state().teams.sendNotifications) {
          dispatch({
            type: SEND_NOTIFICATIONS,
            payload: false
          });
          toastr.success('Request sent');
        }
        return team;
      })
      .catch((error) => {
        console.warn('error', error)
      });
  };
}
export function updateTeam(team, id) {
  const url = `${API_DEV_BASE_URL}/teams/${id}`;
  // Authorization: `Bearer ${state().user.token}`
  return (dispatch, state) => {
    return fetch(url,
      {
        headers: {
          Authorization: `Bearer ${AUTH_DEV_TOKEN}`,
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: getBody(team)
      }
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((response) => {
        const team = response.data;
        dispatch({
          type: SAVE_TEAM,
          payload: team
        });
        dispatch(getTeam(state().user.data.id));
        dispatch({
          type: SET_EDITING,
          payload: false
        });
        if (state().teams.sendNotifications) {
          dispatch({
            type: SEND_NOTIFICATIONS,
            payload: false
          });
          toastr.success('Request sent');
        }
        return team;
      })
      .catch((error) => {
        console.warn('error', error)
      });
  };
}

export function setEditing(value) {
  return {
    type: SET_EDITING,
    payload: value
  };
}

export function sendNotifications() {
  return { 
    type: SEND_NOTIFICATIONS, 
    payload: true 
  };
}
