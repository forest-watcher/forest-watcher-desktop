import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';
import { toastr } from 'react-redux-toastr';

// Actions
const SET_TEMPLATE = 'templates/SET_TEMPLATE';
const SET_TEMPLATES = 'templates/SET_TEMPLATES';
const SET_LOADING_TEMPLATES = 'templates/SET_LOADING_TEMPLATES';
const SET_SAVING_TEMPLATE = 'templates/SET_SAVING_TEMPLATE';

// Reducer
const initialState = {
  ids: [],
  data: {},
  loading: true,
  saving: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEMPLATE: {
      const template = action.payload.template;
      if (state.ids.indexOf( ...Object.keys(template) ) > -1) {
        return {
          ...state,
          data: { ...state.data, ...template }
        };
      } else {
        return {
          ...state,
          ids: [...state.ids, ...Object.keys(template)],
          data: { ...state.data, ...template }
        };
      }
    }
    case SET_TEMPLATES: {
      const templates = action.payload.reports;
      if (templates) return Object.assign({}, state, { ids: Object.keys(templates), data: templates });
      return state;
    }
    case SET_LOADING_TEMPLATES:
      return Object.assign({}, state, { loading: action.payload });
    case SET_SAVING_TEMPLATE:
      return Object.assign({}, state, { saving: action.payload });
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
          type: SET_TEMPLATES,
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

// POST name, geostore ID
export function saveTemplate(template, method) {
  return async (dispatch, state) => {
    const url = method === 'PATCH' ? `${API_BASE_URL}/reports/${template.id}` : `${API_BASE_URL}/reports`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`,
        'Content-Type': 'application/json'
      },
      method: method,
      body: JSON.stringify(template)
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
      const normalized = normalize(data);
        dispatch({
          type: SET_TEMPLATE,
          payload: normalized
        });
        dispatch({
          type: SET_SAVING_TEMPLATE,
          payload: false
        });
      })
      .catch((error) => {
        toastr.error('Unable to save template', error);
        console.warn(error);
        dispatch({
          type: SET_SAVING_TEMPLATE,
          payload: false
        });
      });
  };
}

export function setSaving(bool) {
  return (dispatch) => {
    dispatch({
      type: SET_SAVING_TEMPLATE,
      payload: bool
    });
  };
}