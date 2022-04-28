import normalize from "json-api-normalizer";
import { saveGeostore } from "./geostores";
import { toastr } from "react-redux-toastr";
import omit from "lodash/omit";
import { areaService } from "services/area";
import { utilsService } from "services/utils";

// Actions
const SET_AREA = "areas/SET_AREA";
const SET_AREAS = "areas/SET_AREAS";
const SET_COUNTRIES = "areas/SET_COUNTRIES";
const SET_LOADING_AREAS = "areas/SET_LOADING_AREAS";
const SET_SAVING_AREA = "areas/SET_SAVING_AREA";
const SET_EDITING_AREA = "areas/SET_EDITING_AREA";
const SET_AREA_DELETED = "areas/SET_AREA_DELETED";

// Reducer
const initialState = {
  ids: [],
  data: {},
  countries: [],
  loading: true,
  saving: false,
  editing: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_AREA: {
      const area = action.payload.area;
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
    case SET_SAVING_AREA:
      return Object.assign({}, state, { ...action.payload });
    case SET_EDITING_AREA:
      return Object.assign({}, state, { editing: action.payload });
    default:
      return state;
  }
}

// Action Creators
export function getArea(id) {
  return (dispatch, state) => {
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

export function deleteArea(areaId) {
  return (dispatch, state) => {
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
  return (dispatch, state) => {
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

export function getCountries() {
  return (dispatch, state) => {
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
export function saveArea(area, node, method) {
  return async (dispatch, state) => {
    dispatch({
      type: SET_SAVING_AREA,
      payload: {
        saving: true,
        error: false
      }
    });
    areaService.token = state().user.token;
    areaService
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
export function saveAreaWithGeostore(area, node, method) {
  return async (dispatch, state) => {
    const geostore = await dispatch(saveGeostore(area.geojson));
    const geostoreId = Object.keys(geostore)[0];
    const areaWithGeostore = { ...area, geostore: geostoreId };
    await dispatch(saveArea(areaWithGeostore, node, method));
  };
}

export function setEditing(bool) {
  return async dispatch => {
    await dispatch({
      type: SET_EDITING_AREA,
      payload: bool
    });
  };
}

export function setSaving(payload) {
  return dispatch => {
    dispatch({
      type: SET_SAVING_AREA,
      payload: payload
    });
  };
}

export function setLoading(bool) {
  return dispatch => {
    dispatch({
      type: SET_LOADING_AREAS,
      payload: bool
    });
  };
}
