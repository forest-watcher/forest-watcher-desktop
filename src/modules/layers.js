import { CARTO_URL, API_BASE_URL } from '../constants/global';
import normalize from 'json-api-normalizer';

// Actions
const GET_GFW_LAYERS = 'layers/GET_GFW_LAYERS';
const SET_LAYERS = 'layers/SET_LAYERS';

// Reducer
const initialState = {
  gfw: [],
  selectedLayers: {},
  selectedLayerIds: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_GFW_LAYERS: {
      if (action.payload) {
        return Object.assign({}, state, { gfw: action.payload });
      }
      return state;
    }
    case SET_LAYERS: {
      const selectedLayer = action.payload.selectedLayer;
      if (state.selectedLayerIds.indexOf( ...Object.keys(selectedLayer) ) > -1) {
        return {
          ...state,
          selectedLayers: { ...state.selectedLayers, ...selectedLayer }
        };
      } else {
        return {
          ...state,
          selectedLayerIds: [...state.selectedLayerIds, ...Object.keys(selectedLayer)],
          selectedLayers: { ...state.selectedLayers, ...selectedLayer }
        };
      }
    }
    default:
      return state;
  }
}

// Action Creators
export function getGFWLayers() {
  const url = `${CARTO_URL}/api/v2/sql?q=SELECT title, tileurl FROM layerspec WHERE tileurl is not NULL AND tileurl <> ''`;
  return (dispatch, state) => {
    fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      throw Error(response.statusText);
    })
    .then(async (data) => {
      dispatch({
        type: GET_GFW_LAYERS,
        payload: data.rows
      });
    })
    .catch((error) => {
      console.warn(error);
    });
  };
}

const parseLayer = function(layer){
  return {
    name: layer.title,
    url: layer.tileurl
  }
}

export function createLayer(layer, teamId) {
  let url = `${API_BASE_URL}/v1/contextual-layer`;
  if (teamId) url = `${url}'/teams/${teamId}`;
  return (dispatch, state) => {
    fetch(url, {
        headers: {
          Authorization: `Bearer ${state().user.token}`,
          'Content-Type': 'application/json'
        }, 
        method: 'POST',
        body: JSON.stringify(parseLayer(layer))
      }
    )
    .then((response) => {
      if (response.ok) return response.json();
      throw Error(response.statusText);
    })
    .then(async (data) => {
      const normalized = normalize(data);
      dispatch({
        type: SET_LAYERS,
        payload: {selectedLayer: normalized.contextualLayers}
      });
    })
    .catch((error) => {
      console.warn(error);
    });
  };
}

export function getLayers() {
  let url = `${API_BASE_URL}/v1/contextual-layer`;
  return (dispatch, state) => {
    fetch(url, {
        headers: {
          Authorization: `Bearer ${state().user.token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      if (response.ok) return response.json();
      throw Error(response.statusText);
    })
    .then(async (data) => {
      const normalized = normalize(data);
      dispatch({
        type: SET_LAYERS,
        payload: {selectedLayer: normalized.contextualLayers}
      });
    })
    .catch((error) => {
      console.warn(error);
    });
  };
}