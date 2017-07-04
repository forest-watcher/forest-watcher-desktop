import normalize from 'json-api-normalizer';

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
        dispatch(getTeams());
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
export function updateTeam(team, id) {
  const body = JSON.stringify({
    name: team.name,
    managers: team.managers,
    users: team.users,
    areas: team.areas,
    editing: false
  })
  const url = `http://mymachine:3005/api/v1/teams/${id}`;
  return (dispatch, state) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      },
      method: 'PATCH',
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
        dispatch(getTeams());
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

export function addEmail(email) {
  const url = `http://mymachine:9000/v1/user/email/${email}`;
  return (dispatch, state) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
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
