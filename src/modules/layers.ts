// @ts-ignore missing types
import normalize from "json-api-normalizer";
import { layerService } from "services/layer";
import { CARTO_URL, CARTO_TABLE } from "../constants/global";
import { LAYERS_BLACKLIST } from "../constants/global";
import { AppDispatch, RootState } from "store";

// Actions
const GET_GFW_LAYERS = "layers/GET_GFW_LAYERS";
const SET_LAYERS = "layers/SET_LAYERS";
const SET_LOADING = "layers/SET_LOADING";
const DELETE_LAYERS = "layers/DELETE_LAYERS";

export interface ICartoLayer {
  cartodb_id: number;
  title: string;
  tileurl: string;
}

export interface ICartoLayerResponse {
  rows: ICartoLayer[];
  time: number;
  fields: {
    cartodb_id: { type: string; pgtype: string };
    title: { type: string; pgtype: string };
    tileurl: { type: string; pgtype: string };
  };
  total_rows: number;
}

// Legacy code - used by old Layers code, added to fix TS errors
interface ILegacyLayer {
  id: string;
  attributes: any;
}

export type TLayersState = {
  gfw: ICartoLayerResponse["rows"];
  selectedLayers: any;
  selectedLayerIds: string[];
  loading: boolean;
};

export type TReducerActions =
  | { type: typeof GET_GFW_LAYERS; payload: ICartoLayerResponse["rows"] }
  | { type: typeof SET_LAYERS; payload: { selectedLayer: any } }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof DELETE_LAYERS; payload: { layer: ILegacyLayer } };

// Reducer
const initialState: TLayersState = {
  gfw: [],
  selectedLayers: {},
  selectedLayerIds: [],
  loading: false
};

export default function reducer(state = initialState, action: TReducerActions): TLayersState {
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
        //@ts-ignore - TODO: Figure out typescript error
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
  return (dispatch: AppDispatch) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });
    fetch(url)
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then(async (data: ICartoLayerResponse) => {
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

export function createLayer(layer: ICartoLayer, teamId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    layerService.token = getState().user.token;
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

export function toggleLayer(layer: ILegacyLayer, value: boolean) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    layerService.token = getState().user.token;
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

export function deleteLayer(layer: ILegacyLayer) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    layerService.token = getState().user.token;
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
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    layerService.token = getState().user.token;
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
