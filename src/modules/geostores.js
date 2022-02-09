import normalize from "json-api-normalizer";
import { toastr } from "react-redux-toastr";
import { geoStoreService } from "services/geostores";
import { utilsService } from "services/utils";

// Actions
const SET_GEOSTORE = "geostores/SET_GEOSTORE";
const SET_LOADING_GEOSTORE = "geostores/SET_LOADING_GEOSTORE";
const SET_SAVING_GEOSTORE = "areas/SET_SAVING_GEOSTORE";

// Reducer
const initialState = {
  ids: [],
  data: {},
  loading: false,
  saving: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_GEOSTORE: {
      const geostore = action.payload.geoStore;
      if (state.ids.indexOf(...Object.keys(geostore)) > -1) {
        return {
          ...state,
          data: { ...state.data, ...geostore }
        };
      } else {
        return {
          ...state,
          ids: [...state.ids, ...Object.keys(geostore)],
          data: { ...state.data, ...geostore }
        };
      }
    }
    case SET_LOADING_GEOSTORE:
      return Object.assign({}, state, { loading: action.payload });
    case SET_SAVING_GEOSTORE:
      return Object.assign({}, state, { saving: action.payload });
    default:
      return state;
  }
}

// Action Creators
export function getGeostore(id) {
  return (dispatch, state) => {
    geoStoreService.setToken(state().user.token);
    geoStoreService
      .getGeostore(id)
      .then(data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_GEOSTORE,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_GEOSTORE,
          payload: false
        });
      })
      .catch(error => {
        toastr.error("Unable to load geostore", error);
        dispatch({
          type: SET_LOADING_GEOSTORE,
          payload: false
        });
      });
  };
}

// POST geojson object
export function saveGeostore(geojson) {
  return (dispatch, state) => {
    dispatch({
      type: SET_SAVING_GEOSTORE,
      payload: true
    });

    geoStoreService.setToken(state().user.token);
    return geoStoreService
      .saveGeoStore(geojson)
      .then(data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_GEOSTORE,
          payload: normalized
        });
        dispatch({
          type: SET_SAVING_GEOSTORE,
          payload: false
        });
        return normalized.geoStore;
      })
      .catch(error => {
        dispatch({
          type: SET_SAVING_GEOSTORE,
          payload: false
        });
      });
  };
}

export function getGeoFromShape(shapefile) {
  return (dispatch, state) =>
    utilsService
      .getGeoJSONFromShapeFile(state().user.token, shapefile)
      .then(data => {
        const geojson = data && data.data && data.data.attributes;
        return geojson;
      })
      .catch(() => {
        toastr.error("Unable to load shapefile");
      });
}
