import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants/global';

// Actions
const GET_GEOSTORE = 'geostores/GET_GEOSTORE';
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
    case GET_GEOSTORE: {
      const geostore = action.payload;
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
          type: GET_GEOSTORE,
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
