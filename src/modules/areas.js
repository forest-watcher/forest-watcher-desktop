import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';
import { getGeostore, saveGeostore, updateGeostore } from './geostores';
import domtoimage from 'dom-to-image';
import { toastr } from 'react-redux-toastr';

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
  error: null
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

// POST name, geostore ID
export function saveArea(area, node) {
  return async (dispatch, state) => {
    const url = `${API_BASE_URL}/area`;
    const body = new FormData();
    const blob = await domtoimage.toBlob(node);
    body.append('name', area.name);
    body.append('geostore', area.geostore);
    const image = new File([blob], 'png', {type: 'image/png', name: encodeURIComponent(area.name)})
    body.append('image', image);
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
        toastr.success('Area saved');
        // history.push('/areas');
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
        toastr.error(error);
      });
  };
}

// POST name, geostore ID
export function updateArea(area, node) {
  return async (dispatch, state) => {
    const url = `${API_BASE_URL}/area/${area.id}`;
    const body = new FormData();
    const blob = await domtoimage.toBlob(node);
    body.append('name', area.name);
    body.append('geostore', area.geostore);
    const image = new File([blob], 'png', {type: 'image/png', name: encodeURIComponent(area.name)})
    body.append('image', image);
    dispatch({
      type: SET_LOADING_AREAS,
      payload: true
    });
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      },
      method: 'PATCH',
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
        toastr.success('Area saved');
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
        toastr.error(error);
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
export function saveAreaWithGeostore(area, node) {
  return async (dispatch, state) => {
    const geostore = await dispatch(saveGeostore(area.geojson));
    const geostoreId = Object.keys(geostore)[0];
    const areaWithGeostore = {...area, geostore: geostoreId};
    await dispatch(saveArea(areaWithGeostore, node));
  };
}

// async update geostore then area
export function updateAreaWithGeostore(area, node) {
  return async (dispatch, state) => {
    const geostore = await dispatch(updateGeostore(area.geostore.id, area.geojson));
    const areaWithGeostore = {...area, geostore: geostore.id};
    await dispatch(updateArea(areaWithGeostore, node));
  };
}
