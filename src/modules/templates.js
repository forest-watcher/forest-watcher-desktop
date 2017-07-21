import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';
import { toastr } from 'react-redux-toastr';
import { getArea } from './areas';

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
  saving: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEMPLATE: {
      const template = action.payload.reports;
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
      return Object.assign({}, state, { ...action.payload });
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
        debugger
        dispatch({
          type: SET_LOADING_TEMPLATES,
          payload: false
        });
      });
  };
}

// POST template
export function saveTemplate(template, method) {
  return async (dispatch, state) => {
    const url = method === 'PATCH' ? `${API_BASE_URL}/reports/${template.id}` : `${API_BASE_URL}/reports`;
    dispatch({
      type: SET_SAVING_TEMPLATE,
      payload: {
        saving: true,
        error: false
      }
    });
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
        if (template.areaOfInterest) {
          dispatch(getArea(template.areaOfInterest));
        }
        dispatch({
          type: SET_TEMPLATE,
          payload: normalized
        });
        dispatch({
          type: SET_SAVING_TEMPLATE,
          payload: {
            saving: false,
            error: false
          }
        });
      })
      .catch((error) => {
        dispatch({
          type: SET_SAVING_TEMPLATE,
          payload: {
            saving: false,
            error: true
          }
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