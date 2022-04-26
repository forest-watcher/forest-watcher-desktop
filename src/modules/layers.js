import normalize from "json-api-normalizer";
import { layerService } from "services/layer";
import { CARTO_URL, CARTO_TABLE } from "../constants/global";
import { LAYERS_BLACKLIST } from "../constants/global";
// Actions
const GET_GFW_LAYERS = "layers/GET_GFW_LAYERS";
const SET_LAYERS = "layers/SET_LAYERS";
const SET_LOADING = "layers/SET_LOADING";
const DELETE_LAYERS = "layers/DELETE_LAYERS";

// Reducer
const initialState = {
  gfw: [],
  selectedLayers: {},
  selectedLayerIds: [],
  loading: false
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
      if (selectedLayer) {
        if (state.selectedLayerIds.indexOf(...Object.keys(selectedLayer)) > -1) {
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
      return state;
    }
    case DELETE_LAYERS: {
      const deletedLayer = action.payload.layer;
      if (deletedLayer) {
        const selectedLayers = Object.assign({}, state.selectedLayers);
        delete selectedLayers[deletedLayer.id];
        return {
          ...state,
          selectedLayerIds: state.selectedLayerIds.filter(id => id !== deletedLayer.id),
          selectedLayers
        };
      }
      return state;
    }
    case SET_LOADING: {
      return Object.assign({}, state, { loading: action.payload });
    }
    default:
      return state;
  }
}

// Action Creators
export function getGFWLayers() {
  const url = `${CARTO_URL}/api/v2/sql?q=SELECT cartodb_id, name as title, tileurl FROM ${CARTO_TABLE} WHERE tileurl is not NULL AND tileurl <> '' AND name is not NULL`;
  return dispatch => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });
    fetch(url)
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then(async data => {
        dispatch({
          type: GET_GFW_LAYERS,
          payload: data.rows.filter(layer => !LAYERS_BLACKLIST.includes(layer.cartodb_id))
        });
        dispatch({
          type: SET_LOADING,
          payload: false
        });
      })
      .catch(error => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        console.warn(error);
      });
  };
}

export function createLayer(layer, teamId) {
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    layerService.setToken(state().user.token);
    return layerService
      .createLayer(layer, teamId)
      .then(async data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        dispatch({
          type: SET_LAYERS,
          payload: { selectedLayer: normalized.contextualLayers }
        });
      })
      .catch(error => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        console.warn(error);
      });
  };
}

export function toggleLayer(layer, value) {
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    layerService.setToken(state().user.token);
    return layerService
      .toggleLayer(layer.id, value)
      .then(async data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        dispatch({
          type: SET_LAYERS,
          payload: { selectedLayer: normalized.contextualLayers }
        });
      })
      .catch(error => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        console.warn(error);
      });
  };
}

export function deleteLayer(layer) {
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    layerService.setToken(state().user.token);
    return layerService
      .deleteLayer(layer.id)
      .then(response => {
        if (!response.ok) throw Error(response.statusText);
      })
      .then(() => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        dispatch({
          type: DELETE_LAYERS,
          payload: { layer }
        });
      })
      .catch(error => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        console.warn(error);
      });
  };
}

export function getLayers() {
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    layerService.setToken(state().user.token);
    return layerService
      .getLayers()
      .then(async data => {
        const normalized = normalize(data);
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        dispatch({
          type: SET_LAYERS,
          payload: { selectedLayer: normalized.contextualLayers }
        });
      })
      .catch(error => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        console.warn(error);
      });
  };
}
