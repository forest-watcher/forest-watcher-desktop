import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants';

// Actions
const GET_USER_AREAS = 'areas/GET_AREAS';

// Reducer
const initialState = {
  ids: [],
  area: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_AREAS: {
      const { area } = action.payload;
      if (area) return Object.assign({}, state, { ids: Object.keys(area), area });
      return state;
    }
    default:
      return state;
  }
}

// Action Creators
export function getUserAreas() {
  const url = `${API_BASE_URL}/area`;
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
      .then((data) => {
      const normalized = normalize(data);
        dispatch({
          type: GET_USER_AREAS,
          payload: normalized
        });
      })
      .catch((error) => {
        console.info(error);
        // To-do
      });
  };
}