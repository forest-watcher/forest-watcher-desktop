import { API_BASE_URL } from '../constants/global'
import { unique } from '../helpers/utils';
import { toastr } from 'react-redux-toastr';

// Actions
const GET_TEAM = 'teams/GET_TEAM';
const SAVE_TEAM = 'teams/SAVE_TEAM';
const SET_EDITING = 'teams/SET_EDITING';
const SET_LOADING = 'teams/SET_LOADING';
const SET_SAVING = 'teams/SET_SAVING';
const SEND_NOTIFICATIONS = 'teams/SEND_NOTIFICATIONS'

// Reducer
const initialState = {
  data: null,
  sendNotifications: false,
  editing: false,
  loading: true,
  saving: false
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
    case SET_LOADING:{
      return Object.assign({}, state, { loading: action.payload });
    }
    case SET_SAVING:{
      return Object.assign({}, state, { saving: action.payload });
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
  const url = `${API_BASE_URL}/teams/user/${userId}`;
  return (dispatch, state) => {

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
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
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        return team;
      })
      .catch((error) => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        console.warn('error', error)
      });
  };
}

const getBody = (team, locale) => {
  return JSON.stringify({
    name: team.name,
    managers: team.managers.filter(unique),
    confirmedUsers: team.confirmedUsers.filter(unique),
    users: team.users.filter(unique),
    areas: team.areas,
    locale: locale
  })
}

export function createTeam(team) {
  const url = `${API_BASE_URL}/teams/`;
  return (dispatch, state) => {
    dispatch({
      type: SET_SAVING,
      payload: true
    });
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: getBody(team, state().app.locale)
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
        dispatch({
          type: SET_SAVING,
          payload: false
        });
        dispatch(getTeam(state().user.data.id));
        if (state().teams.sendNotifications) {
          toastr.success('Request sent');
          dispatch({
            type: SEND_NOTIFICATIONS,
            payload: false
          });
        }
        return team;
      })
      .catch((error) => {
        dispatch({
          type: SET_SAVING,
          payload: false
        });
        console.warn('error', error)
      });
  };
}

export function updateTeam(team, id) {
  const url = `${API_BASE_URL}/teams/${id}`;
  return (dispatch, state) => {
    dispatch({
      type: SET_SAVING,
      payload: true
    });
    return fetch(url,
      {
        headers: {
          Authorization: `Bearer ${state().user.token}`,
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: getBody(team, state().app.locale)
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
        dispatch({
          type: SET_SAVING,
          payload: false
        });
        dispatch(getTeam(state().user.data.id));
        dispatch({
          type: SET_EDITING,
          payload: false
        });
        if (state().teams.sendNotifications) {
          toastr.success('Request sent');
          dispatch({
            type: SEND_NOTIFICATIONS,
            payload: false
          });
        }
        return team;
      })
      .catch((error) => {
        dispatch({
          type: SET_SAVING,
          payload: false
        });
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

export function setLoading(value) {
  return {
    type: SET_LOADING,
    payload: value
  };
}

export function setSaving(value) {
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
