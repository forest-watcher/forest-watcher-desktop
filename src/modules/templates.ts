// @ts-ignore missing types
import normalize from "json-api-normalizer";
import { TReport, reportService, TGetTemplates } from "services/reports";
import { getAreas } from "./areas";
import { AppDispatch, RootState } from "../store";

// Actions
const SET_TEMPLATE = "templates/SET_TEMPLATE";
const SET_TEMPLATES = "templates/SET_TEMPLATES";
const SET_TEMPLATES_LEGACY = "templates/SET_TEMPLATES_LEGACY";
const DELETE_TEMPLATE = "templates/DELETE_TEMPLATE";
const SET_LOADING_TEMPLATES = "templates/SET_LOADING_TEMPLATES";
const SET_SAVING_TEMPLATE = "templates/SET_SAVING_TEMPLATE";
const SET_DELETING_TEMPLATE = "templates/SET_DELETING_TEMPLATE";

export type TReducerActions =
  | { type: typeof SET_TEMPLATE; payload: any }
  | { type: typeof SET_TEMPLATES; payload: any }
  | { type: typeof SET_TEMPLATES_LEGACY; payload: any }
  | { type: typeof DELETE_TEMPLATE; payload: any }
  | { type: typeof SET_LOADING_TEMPLATES; payload: any }
  | { type: typeof SET_SAVING_TEMPLATE; payload: any }
  | { type: typeof SET_DELETING_TEMPLATE; payload: { token: string } };

export type TTemplatesState = {
  data: any;
  ids: string[];
  templates: TGetTemplates["data"];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: boolean;
};

// Reducer
const initialState: TTemplatesState = {
  ids: [],
  data: {},
  templates: [],
  loading: true,
  saving: false,
  deleting: false,
  error: false
};

export default function reducer(state = initialState, action: TReducerActions) {
  switch (action.type) {
    case SET_TEMPLATE: {
      const template = action.payload.reports;
      const templateKeys = Object.keys(template);
      console.log(templateKeys);
      //@ts-ignore
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
    case SET_TEMPLATES:
      return Object.assign({}, state, { templates: action.payload });
    case SET_TEMPLATES_LEGACY: {
      const templates = action.payload.reports;
      if (templates) return Object.assign({}, state, { ids: Object.keys(templates), data: templates });
      return state;
    }
    case SET_LOADING_TEMPLATES:
      return Object.assign({}, state, { loading: action.payload });
    case DELETE_TEMPLATE: {
      const templateId = action.payload;
      if (templateId) {
        const templates: any = Object.assign({}, state.data);
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
  return (dispatch: AppDispatch, state: () => RootState) => {
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
          type: SET_TEMPLATES_LEGACY,
          payload: normalized
        });
        dispatch({
          type: SET_TEMPLATES,
          payload: data.data
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

export function getTemplate(templateId: string) {
  return (dispatch: AppDispatch, state: () => RootState) => {
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

export function saveTemplate(template: TReport, method: string, templateId: string) {
  return async (dispatch: AppDispatch, state: () => RootState) => {
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
export function deleteTemplate(templateId: string, aois: string[]) {
  return async (dispatch: AppDispatch, state: () => RootState) => {
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

// export function setSaving(payload) {
//   return dispatch => {
//     dispatch({
//       type: SET_SAVING_TEMPLATE,
//       payload: payload
//     });
//   };
// }
