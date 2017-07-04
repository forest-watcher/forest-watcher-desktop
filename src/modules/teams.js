import { API_DEV_BASE_URL, AUTH_DEV_TOKEN } from '../constants/global'
import { includes, unique } from '../helpers/utils';

// Actions
const GET_TEAM = 'teams/GET_TEAM';
const SAVE_TEAM = 'teams/SAVE_TEAM';
const SET_EDITING = 'teams/SET_EDITING';
const ADD_USER = 'teams/ADD_USER';

// Reducer
const initialState = {
  data: null
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
    case ADD_USER:{
      return state;
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
        dispatch({
          type: SAVE_TEAM,
          payload: response.data
        });
        dispatch(getTeam(state().user.data.id));
        dispatch({
          type: SET_EDITING,
          payload: false
        });
        return response.data;
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

export function addEmail(email) {
  const url = `${API_DEV_BASE_URL}user/email/${email}`;
  // Authorization: `Bearer ${state().user.token}`
  return (dispatch, state) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTH_DEV_TOKEN}`
      },
      method: 'GET'
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        dispatch({ type: ADD_USER })
        return data;
      })
      .catch((error) => {
        // Add toaster error for not found
        console.warn('error', error)
      });
  };
}
