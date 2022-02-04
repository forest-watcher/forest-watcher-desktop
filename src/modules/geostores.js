import normalize from "json-api-normalizer";
import { API_BASE_URL } from "../constants/global";
import { toastr } from "react-redux-toastr";

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
  const url = `${API_BASE_URL}/geostore/${id}`;
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_GEOSTORE,
      payload: true
    });
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
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
  const url = `${API_BASE_URL}/geostore`;
  const body = {
    geojson: geojson
  };
  return (dispatch, state) => {
    dispatch({
      type: SET_SAVING_GEOSTORE,
      payload: true
    });
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
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
  return (dispatch, state) => {
    const url = `${API_BASE_URL}/ogr/convert`;
    const body = new FormData();
    body.append("file", shapefile);
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      },
      method: "POST",
      body
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then(data => {
        const geojson = data && data.data && data.data.attributes;
        return geojson;
      })
      .catch(() => {
        toastr.error("Unable to load shapefile");
      });
  };
}
