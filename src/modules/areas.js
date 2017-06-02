import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';

// Actions
const GET_USER_AREAS = 'areas/GET_AREAS';
const SET_LOADING_AREAS = 'areas/SET_LOADING_AREAS';
const SET_LOADING_AREAS_ERROR = 'areas/SET_LOADING_AREAS_ERROR';

// Reducer
const initialState = {
  ids: [],
  area: {},
  loading: false,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_AREAS: {
      const { area } = action.payload;
      if (area) return Object.assign({}, state, { ids: Object.keys(area), area });
      return state;
    }
    case SET_LOADING_AREAS:
      return Object.assign({}, state, { loading: action.payload });
    case SET_LOADING_AREAS_ERROR:
      return Object.assign({}, state, { error: action.payload });
    default:
      return state;
  }
}

// Action Creators
export function getUserAreas() {
  const url = `${API_BASE_URL}/area`;
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_AREAS,
      payload: true
    });
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
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      })
      .catch((error) => {
        dispatch({
          type: SET_LOADING_AREAS_ERROR,
          payload: error
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      });
  };
}
