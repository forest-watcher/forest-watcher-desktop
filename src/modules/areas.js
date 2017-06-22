import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';
import { getGeostore, saveGeostore } from './geostores';

// Actions
const SET_AREA = 'areas/SET_AREA';
const SET_AREAS = 'areas/SET_AREAS';
const SET_LOADING_AREAS = 'areas/SET_LOADING_AREAS';
const SET_LOADING_AREAS_ERROR = 'areas/SET_LOADING_AREAS_ERROR';

// Reducer
const initialState = {
  ids: [],
  areas: {},
  loading: false,
  error: null,
  saving: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_AREA: {
      const area = action.payload.area;
      if (area) return {
        ...state,
        ids: [...state.ids, ...Object.keys(area)],
        areas: { ...state.areas, ...area }
      };
      return state;
    }
    case SET_AREAS: {
      const { area: areas } = action.payload;
      if (areas) return Object.assign({}, state, { ids: Object.keys(areas), areas });
      return state;
    }
    case SET_LOADING_AREAS:
      return Object.assign({}, state, { loading: action.payload });
    case SET_LOADING_AREAS_ERROR:
      return Object.assign({}, state, { error: action.payload });
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
        dispatch({
          type: SET_LOADING_AREAS_ERROR,
          payload: error
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      });
  };
}

export function getAreas() {
  const url = `${API_BASE_URL}/area`;
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
        dispatch({
          type: SET_LOADING_AREAS_ERROR,
          payload: error
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      });
  };
}

export function saveArea(area) {
  const url = `${API_BASE_URL}/area`;
  const body = new FormData();
  body.append('name', area.name);
  body.append('geostore', area.geostore);
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_AREAS,
      payload: true
    });
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      },
      method: 'POST',
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
          type: SET_LOADING_AREAS,
          payload: false
        });
      })
      .catch((error) => {
        dispatch({
          type: SET_LOADING_AREAS_ERROR,
          payload: error
        });
        dispatch({
          type: SET_LOADING_AREAS,
          payload: false
        });
      });
  };
}

// async get Areas and their Geostores
export function getGeoStoresWithAreas() {
  return async (dispatch, state) => {
    await dispatch(getAreas());
    let promises = [];
    const areasIds = state().areas.ids;
    const areas = state().areas.areas;
    areasIds.forEach((id) => {
      promises.push(dispatch(getGeostore(areas[id].attributes.geostore)));
    })
    await Promise.all(promises);
  };
}

// async save geostore then area
export function saveAreaWithGeostore(area) {
  return async (dispatch, state) => {
    const geostore = await dispatch(saveGeostore(area.geojson));
    const geostoreId = Object.keys(geostore)[0];
    const areaWithGeostore = {...area, geostore: geostoreId};
    await dispatch(saveArea(areaWithGeostore));
  };
}
