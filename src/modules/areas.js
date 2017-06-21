import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';
import { getGeostore } from './geostores';

// Actions
const GET_AREA = 'areas/GET_AREA';
const GET_AREAS = 'areas/GET_AREAS';
const SET_AREA = 'areas/SET_AREA';
const SET_LOADING_AREAS = 'areas/SET_LOADING_AREAS';
const SET_SAVING_AREA = 'areas/SET_SAVING_AREA';
const SET_LOADING_AREAS_ERROR = 'areas/SET_LOADING_AREAS_ERROR';
const SET_SAVING_AREA_ERROR = 'areas/SET_SAVING_AREA_ERROR';

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
    case GET_AREA: {
      const area = action.payload;
      if (area) return {
        ...state,
        ids: [...state.ids, ...Object.keys(area)],
        areas: { ...state.area, ...area }
      };
      return state;
    }
    case GET_AREAS: {
      const { area: areas } = action.payload;
      if (areas) return Object.assign({}, state, { ids: Object.keys(areas), areas });
      return state;
    }
    case SET_AREA: {
      const area = action.payload;
      return Object.assign({}, state, { ids: Object.keys(area), area });
    }
    case SET_LOADING_AREAS:
      return Object.assign({}, state, { loading: action.payload });
    case SET_SAVING_AREA:
      return Object.assign({}, state, { saving: action.payload });
    case SET_LOADING_AREAS_ERROR:
      return Object.assign({}, state, { error: action.payload });
    case SET_SAVING_AREA_ERROR:
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
          type: GET_AREA,
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
          type: GET_AREAS,
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
