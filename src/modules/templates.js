import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';

// Actions
const GET_USER_TEMPLATES = 'reports/GET_REPORTS';
const SET_LOADING_TEMPLATES = 'reports/SET_LOADING_TEMPLATES';
const SET_LOADING_TEMPLATES_ERROR = 'reports/SET_LOADING_TEMPLATES_ERROR';

// Reducer
const initialState = {
  ids: [],
  data: {},
  loading: false,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_TEMPLATES: {
      const templates = action.payload.reports;
      if (templates) return Object.assign({}, state, { ids: Object.keys(templates), data: templates });
      return state;
    }
    case SET_LOADING_TEMPLATES:
      return Object.assign({}, state, { loading: action.payload });
    case SET_LOADING_TEMPLATES_ERROR:
      return Object.assign({}, state, { error: action.payload });
    default:
      return state;
  }
}

// Action Creators
export function getUserTemplates() {
  const url = `${API_BASE_URL}/reports`;
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_TEMPLATES,
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
          type: GET_USER_TEMPLATES,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_TEMPLATES,
          payload: false
        });
      })
      .catch((error) => {
        dispatch({
          type: SET_LOADING_TEMPLATES_ERROR,
          payload: error
        });
        dispatch({
          type: SET_LOADING_TEMPLATES,
          payload: false
        });
      });
  };
}
