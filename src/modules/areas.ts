// @ts-ignore - no types available
import normalize from "json-api-normalizer";
import { saveGeostore } from "./geostores";
import { toastr } from "react-redux-toastr";
import omit from "lodash/omit";
import { areaService, TAreasInTeam } from "services/area";
import { utilsService } from "services/utils";
import { AppDispatch, RootState } from "store";
import { TGetTeamResponse } from "services/teams";
import { LOGOUT } from "modules/user";

// Actions
const SET_AREA = "areas/SET_AREA";
const SET_AREAS = "areas/SET_AREAS";
const SET_AREA_TEAMS = "areas/SET_AREA_TEAMS";
const SET_AREAS_IN_USERS_TEAMS = "areas/SET_AREAS_IN_USERS_TEAMS";
const SET_LOADING_AREAS_IN_USERS_TEAMS = "areas/SET_LOADING_AREAS_IN_USERS_TEAMS";
const SET_COUNTRIES = "areas/SET_COUNTRIES";
const SET_LOADING_AREAS = "areas/SET_LOADING_AREAS";
const SET_SAVING_AREA = "areas/SET_SAVING_AREA";
const SET_EDITING_AREA = "areas/SET_EDITING_AREA";
const SET_AREA_DELETED = "areas/SET_AREA_DELETED";

export type TAreasState = {
  ids: string[];
  data: any;
  countries: any[];
  areaTeams: TGetTeamResponse[];
  areasInUsersTeams: TAreasInTeam[];
  loading: boolean;
  loadingAreasInUsers: boolean;
  saving: boolean;
  editing: boolean;
  error: boolean;
};

export type TReducerActions =
  | { type: typeof SET_AREA; payload: any }
  | { type: typeof SET_AREAS; payload: any }
  | { type: typeof SET_AREA_TEAMS; payload: { areaTeams: TAreasState["areaTeams"] } }
  | { type: typeof SET_AREAS_IN_USERS_TEAMS; payload: { areasInUsersTeams: TAreasState["areasInUsersTeams"] } }
  | { type: typeof SET_LOADING_AREAS_IN_USERS_TEAMS; payload: boolean }
  | { type: typeof SET_COUNTRIES; payload: any }
  | { type: typeof SET_LOADING_AREAS; payload: any }
  | { type: typeof SET_SAVING_AREA; payload: any }
  | { type: typeof SET_EDITING_AREA; payload: any }
  | { type: typeof SET_AREA_DELETED; payload: any }
  | { type: typeof LOGOUT; payload: null };

// Reducer
const initialState: TAreasState = {
  ids: [],
  data: {},
  countries: [],
  areaTeams: [],
  areasInUsersTeams: [],
  loading: true,
  loadingAreasInUsers: true,
  saving: false,
  editing: false,
  error: false
};

export default function reducer(state = initialState, action: TReducerActions): TAreasState {
  switch (action.type) {
    case SET_AREA: {
      const area = action.payload.area;
      //@ts-ignore - TODO: Figure out typescript error
      if (state.ids.indexOf(...Object.keys(area)) > -1) {
        return {
          ...state,
          data: { ...state.data, ...area }
        };
      } else {
        return {
          ...state,
          ids: [...state.ids, ...Object.keys(area)],
          data: { ...state.data, ...area }
        };
      }
    }
    case SET_AREAS: {
      const { area: areas } = action.payload;
      if (areas) return Object.assign({}, state, { ids: Object.keys(areas), data: areas });
      return state;
    }
    case SET_AREA_TEAMS: {
      return Object.assign({}, state, { areaTeams: action.payload });
    }
    case SET_AREAS_IN_USERS_TEAMS: {
      return Object.assign({}, state, { areasInUsersTeams: action.payload });
    }
    case SET_AREA_DELETED: {
      const areaId = action.payload;
      const ids = state.ids.filter(id => id !== areaId);
      const data = omit(state.data, areaId);
      return { ...state, ids, data };
    }
    case SET_COUNTRIES:
      return Object.assign({}, state, { countries: action.payload });
    case SET_LOADING_AREAS:
      return Object.assign({}, state, { loading: action.payload });
    case SET_LOADING_AREAS_IN_USERS_TEAMS:
      return Object.assign({}, state, { loadingAreasInUsers: action.payload });
    case SET_SAVING_AREA:
      return Object.assign({}, state, { ...action.payload });
    case SET_EDITING_AREA:
      return Object.assign({}, state, { editing: action.payload });
    case LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}

// Action Creators
export function getArea(id: string) {
  return (dispatch: AppDispatch, state: () => RootState) => {
    dispatch({
      type: SET_LOADING_AREAS,
      payload: true
    });

    areaService.token = state().user.token;

    return areaService
      .getArea(id)
      .then(data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_AREA,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
        return normalized;
      })
      .catch(error => {
        toastr.error("Unable to load area", error);
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      });
  };
}

export function deleteArea(areaId: string) {
  return (dispatch: AppDispatch, state: () => RootState) => {
    areaService.token = state().user.token;
    areaService
      .deleteArea(areaId)
      .then(() => {
        dispatch({
          type: SET_AREA_DELETED,
          payload: areaId
        });
      })
      .catch(error => {
        console.warn(error);
      });
  };
}

export function getAreas() {
  return (dispatch: AppDispatch, state: () => RootState) => {
    dispatch({
      type: SET_LOADING_AREAS,
      payload: true
    });
    areaService.token = state().user.token;
    return areaService
      .getAreaFW()
      .then(data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_AREAS,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
        return normalized;
      })
      .catch(error => {
        toastr.error("Unable to load areas", error);
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      });
  };
}

export function getAreaTeams(areaId: string) {
  return (dispatch: AppDispatch, state: () => RootState) => {
    return areaService
      .getAreaTeams(areaId)
      .then(data => {
        dispatch({
          type: SET_AREA_TEAMS,
          payload: data
        });
        return data;
      })
      .catch(error => {
        toastr.error("Unable to load area teams", error);
      });
  };
}

export function getAreasInUsersTeams() {
  return (dispatch: AppDispatch, state: () => RootState) => {
    dispatch({
      type: SET_LOADING_AREAS_IN_USERS_TEAMS,
      payload: true
    });
    return areaService
      .getAreasInUsersTeams()
      .then(data => {
        dispatch({
          type: SET_AREAS_IN_USERS_TEAMS,
          payload: data
        });
        return data;
      })
      .catch(error => {
        console.log(error);
        toastr.error("Unable to load team areas", error);
      })
      .finally(() => {
        dispatch({
          type: SET_LOADING_AREAS_IN_USERS_TEAMS,
          payload: false
        });
      });
  };
}

export function getCountries() {
  return (dispatch: AppDispatch) => {
    return utilsService
      .getCountries()
      .then(data => {
        dispatch({
          type: SET_COUNTRIES,
          payload: data.rows
        });
      })
      .catch(error => {
        console.info("failed to fetch countries");
      });
  };
}

// POST name, geostore ID
export function saveArea(area: any, node: HTMLCanvasElement, method: string) {
  return (dispatch: AppDispatch, state: () => RootState) => {
    dispatch({
      type: SET_SAVING_AREA,
      payload: {
        saving: true,
        error: false
      }
    });
    areaService.token = state().user.token;
    return areaService
      .saveArea(area, node, method)
      .then(data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_AREA,
          payload: normalized
        });
        dispatch({
          type: SET_SAVING_AREA,
          payload: {
            saving: false,
            error: false
          }
        });
        return normalized;
      })
      .catch(error => {
        dispatch({
          type: SET_SAVING_AREA,
          payload: {
            saving: false,
            error: true
          }
        });
      });
  };
}

// async save geostore then area
export function saveAreaWithGeostore(area: any, node: HTMLCanvasElement, method: string) {
  return async (dispatch: AppDispatch) => {
    const geostore = await dispatch(saveGeostore(area.geojson));
    const geostoreId = Object.keys(geostore)[0];
    const areaWithGeostore = { ...area, geostore: geostoreId };
    return await dispatch(saveArea(areaWithGeostore, node, method));
  };
}

export function setEditing(bool: boolean) {
  return async (dispatch: AppDispatch) => {
    await dispatch({
      type: SET_EDITING_AREA,
      payload: bool
    });
  };
}

export function setSaving(payload: boolean) {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: SET_SAVING_AREA,
      payload: payload
    });
  };
}

export function setLoading(bool: boolean) {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: SET_LOADING_AREAS,
      payload: bool
    });
  };
}
