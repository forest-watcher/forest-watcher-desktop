import normalize from "json-api-normalizer";
import { reportService } from "services/reports";
import { getAreas } from "./areas";

// Actions
const SET_TEMPLATE = "templates/SET_TEMPLATE";
const SET_TEMPLATES = "templates/SET_TEMPLATES";
const DELETE_TEMPLATE = "templates/DELETE_TEMPLATE";
const SET_LOADING_TEMPLATES = "templates/SET_LOADING_TEMPLATES";
const SET_SAVING_TEMPLATE = "templates/SET_SAVING_TEMPLATE";
const SET_DELETING_TEMPLATE = "templates/SET_DELETING_TEMPLATE";

// Reducer
const initialState = {
  ids: [],
  data: {},
  loading: true,
  saving: false,
  deleting: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEMPLATE: {
      const template = action.payload.reports;
      if (state.ids.indexOf(...Object.keys(template)) > -1) {
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
    case DELETE_TEMPLATE: {
      const templateId = action.payload;
      if (templateId) {
        const templates = Object.assign({}, state.data);
        delete templates[templateId];
        return {
          ...state,
          ids: state.ids.filter(id => id !== templateId),
          data: templates
        };
      }
      return state;
    }
    case SET_SAVING_TEMPLATE:
      return Object.assign({}, state, { ...action.payload });
    case SET_DELETING_TEMPLATE:
      return Object.assign({}, state, { ...action.payload });
    default:
      return state;
  }
}

// Action Creators
export function getTemplates() {
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_TEMPLATES,
      payload: true
    });

    reportService.token = state().user.token;
    return reportService
      .getTemplates()
      .then(data => {
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
      .catch(error => {
        dispatch({
          type: SET_LOADING_TEMPLATES,
          payload: false
        });
      });
  };
}

export function getTemplate(templateId) {
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_TEMPLATES,
      payload: true
    });

    reportService.token = state().user.token;
    return reportService
      .getTemplate(templateId)
      .then(data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_TEMPLATE,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_TEMPLATES,
          payload: false
        });
        return normalized;
      })
      .catch(error => {
        dispatch({
          type: SET_LOADING_TEMPLATES,
          payload: false
        });
      });
  };
}

export function saveTemplate(template, method, templateId) {
  return async (dispatch, state) => {
    dispatch({
      type: SET_SAVING_TEMPLATE,
      payload: {
        saving: true,
        error: false
      }
    });

    reportService.token = state().user.token;
    return reportService
      .saveTemplate(template, method, templateId)
      .then(data => {
        const normalized = normalize(data);
        dispatch(getAreas());
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
      .catch(error => {
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

// DELETE template
export function deleteTemplate(templateId, aois) {
  return async (dispatch, state) => {
    dispatch({
      type: SET_DELETING_TEMPLATE,
      payload: {
        deleting: true,
        error: false
      }
    });
    return reportService
      .deleteTemplate(templateId, aois)
      .then(() => {
        dispatch({
          type: DELETE_TEMPLATE,
          payload: templateId
        });
        dispatch(getAreas());
        dispatch({
          type: SET_DELETING_TEMPLATE,
          payload: {
            deleting: false,
            error: false
          }
        });
      })
      .catch(error => {
        dispatch({
          type: SET_DELETING_TEMPLATE,
          payload: {
            deleting: false,
            error: true
          }
        });
      });
  };
}

export function setSaving(payload) {
  return dispatch => {
    dispatch({
      type: SET_SAVING_TEMPLATE,
      payload: payload
    });
  };
}
