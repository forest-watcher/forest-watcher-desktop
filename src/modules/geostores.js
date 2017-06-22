import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';

// Actions
const SET_GEOSTORE = 'geostores/SET_GEOSTORE';
const SET_LOADING_GEOSTORE = 'geostores/SET_LOADING_GEOSTORE';
const SET_LOADING_GEOSTORE_ERROR = 'geostores/SET_LOADING_GEOSTORE_ERROR';

// Reducer
const initialState = {
  ids: [],
  geostores: {},
  loading: false,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_GEOSTORE: {
      const geostore = action.payload.geoStore;
      if (geostore) return {
        ...state,
        ids: [...state.ids, ...Object.keys(geostore)],
        geostores: { ...state.geostores, ...geostore }
      };
      return state;
    }
    case SET_LOADING_GEOSTORE:
      return Object.assign({}, state, { loading: action.payload });
    case SET_LOADING_GEOSTORE_ERROR:
      return Object.assign({}, state, { error: action.payload });
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
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
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
      .catch((error) => {
        dispatch({
          type: SET_LOADING_GEOSTORE_ERROR,
          payload: error
        });
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
  }
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_GEOSTORE,
      payload: true
    });
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
      const normalized = normalize(data);
        dispatch({
          type: SET_GEOSTORE,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_GEOSTORE,
          payload: false
        });
        return normalized.geoStore;
      })
      .catch((error) => {
        dispatch({
          type: SET_LOADING_GEOSTORE_ERROR,
          payload: error
        });
        dispatch({
          type: SET_LOADING_GEOSTORE,
          payload: false
        });
      });
  };
}
