import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';
import { toastr } from 'react-redux-toastr';

// Actions
const GET_TEMPLATES = 'templates/GET_TEMPLATES';
const SET_LOADING_TEMPLATES = 'templates/SET_LOADING_TEMPLATES';

// Reducer
const initialState = {
  ids: [],
  data: {},
  loading: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_TEMPLATES: {
      const templates = action.payload.reports;
      if (templates) return Object.assign({}, state, { ids: Object.keys(templates), data: templates });
      return state;
    }
    case SET_LOADING_TEMPLATES:
      return Object.assign({}, state, { loading: action.payload });
    default:
      return state;
  }
}

// Action Creators
export function getTemplates() {
  const url = `${API_BASE_URL}/reports`;
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_TEMPLATES,
      payload: true
    });
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
          type: GET_TEMPLATES,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_TEMPLATES,
          payload: false
        });
        return normalized;
      })
      .catch((error) => {
        dispatch({
          type: SET_LOADING_TEMPLATES,
          payload: false
        });
        toastr.error('Unable to load templates', error);
      });
  };
}