import normalize from 'json-api-normalizer';
import { API_BASE_URL, CARTO_COUNTRIES } from '../constants/global';
import { BLOB_CONFIG } from '../constants/map';
import { saveGeostore } from './geostores';
import domtoimage from 'dom-to-image';
import { toastr } from 'react-redux-toastr';

// Actions
const SET_AREA = 'areas/SET_AREA';
const SET_AREAS = 'areas/SET_AREAS';
const SET_COUNTRIES = 'areas/SET_COUNTRIES';
const SET_LOADING_AREAS = 'areas/SET_LOADING_AREAS';
const SET_SAVING_AREA = 'areas/SET_SAVING_AREA';
const SET_EDITING_AREA = 'areas/SET_EDITING_AREA';

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
      if (state.ids.indexOf( ...Object.keys(area) ) > -1) {
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
  const url = `${API_BASE_URL}/area/${id}`;
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_AREAS,
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
          type: SET_AREA,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
        return normalized;
      })
      .catch((error) => {
        toastr.error('Unable to load area', error);
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      });
  };
}

export function getAreas() {
  const url = `${API_BASE_URL}/area/fw`;
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_AREAS,
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
          type: SET_AREAS,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
        return normalized;
      })
      .catch((error) => {
        toastr.error('Unable to load areas', error);
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      });
  };
}

export function getCountries() {
  const url = `${CARTO_COUNTRIES}`;
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_AREAS,
      payload: true
    });
    return fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: SET_COUNTRIES,
          payload: data.rows
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      })
      .catch((error) => {
        toastr.error('Unable to load countries', error);
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
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
    const url = method === 'PATCH' ? `${API_BASE_URL}/area/${area.id}` : `${API_BASE_URL}/area`;
    const body = new FormData();
    const blob = await domtoimage.toBlob(node, BLOB_CONFIG);
    body.append('name', area.name);
    body.append('geostore', area.geostore);
    const image = new File([blob], 'png', {type: 'image/png', name: encodeURIComponent(area.name)})
    body.append('image', image);
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      },
      method: method,
      body
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
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
      .catch((error) => {
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
    const areaWithGeostore = {...area, geostore: geostoreId};
    await dispatch(saveArea(areaWithGeostore, node, method));
  };
}

export function setEditing(bool) {
  return async (dispatch) => {
    await dispatch({
      type: SET_EDITING_AREA,
      payload: bool
    });
  };
}

export function setSaving(payload) {
  return (dispatch) => {
    dispatch({
      type: SET_SAVING_AREA,
      payload: payload
    });
  };
}

export function setLoading(bool) {
  return (dispatch) => {
    dispatch({
      type: SET_LOADING_AREAS,
      payload: bool
    });
  };
}
