import normalize from 'json-api-normalizer';

// Actions
const GET_TEAMS = 'teams/GET_TEAMS';
const SAVE_TEAM = 'teams/SAVE_TEAM';
const SET_EDITING = 'teams/SET_EDITING';

// Reducer
const initialState = {
  ids: [],
  data: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_TEAMS: {
      const teams = action.payload.team;
      if (teams) return Object.assign({}, state, { ids: Object.keys(teams), data: teams });
      return state;
    }
    case SAVE_TEAM: {
      const team = action.payload.team;
      if (state.ids.indexOf( ...Object.keys(team) ) > -1) {
        return {
          ...state,
          teams: { ...state.teams, ...team }
        };
      } else {
        return {
          ...state,
          ids: [...state.ids, ...Object.keys(team)],
          teams: { ...state.teams, ...team }
        };
      }
    }
    case SET_EDITING:{
      return Object.assign({}, state, { editing: action.payload });
    }
    default:
      return state;
  }
}

// Action Creators

export function getTeams() {
  const url = `http://mymachine:3005/api/v1/teams/`;
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
      .then((data) => {
      const normalized = normalize(data);
        dispatch({
          type: GET_TEAMS,
          payload: normalized
        });
        return normalized;
      })
      .catch((error) => {
        console.warn('error', error)
      });
  };
}

export function createTeam(team) {
  const body = JSON.stringify({
    name: team.name,
    managers: team.managers,
    users: team.users,
    areas: team.areas,
    editing: false
  })
  const url = `http://mymachine:3005/api/v1/teams/`;
  return (dispatch, state) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      },
      method: 'POST',
      body
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
      const normalized = normalize(data);
        dispatch({
          type: SAVE_TEAM,
          payload: normalized
        });
        dispatch({
          type: SET_EDITING,
          payload: false
        });
        return normalized;
      })
      .catch((error) => {
        console.warn('error', error)
      });
  };
}

export function updateTeam() {
  const url = `http://mymachine:3005/api/v1/teams/`;
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
      .then((data) => {
      const normalized = normalize(data);
        dispatch({
          type: GET_TEAMS,
          payload: normalized
        });
        dispatch({
          type: SET_EDITING,
          payload: false
        });
        return normalized;
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