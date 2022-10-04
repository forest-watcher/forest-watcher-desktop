import { AppDispatch } from "store";
import { basemapService } from "services/basemap";
import { getPlanetBasemaps as getFriendlyPlanetBasemaps, IPlanetBasemap } from "helpers/basemap";

// Actions
const SET_PLANET_BASEMAPS = "map/SET_PLANET_BASEMAPS";
const SET_FETCHING = "map/SET_FETCHING";

export type TMapState = {
  data: IPlanetBasemap[];
  fetching: boolean;
};

// Reducer
const initialState: TMapState = {
  data: [],
  fetching: false
};

export type TReducerActions =
  | { type: typeof SET_PLANET_BASEMAPS; payload: IPlanetBasemap[] }
  | { type: typeof SET_FETCHING; payload: any };

export default function reducer(state = initialState, action: TReducerActions): TMapState {
  switch (action.type) {
    case SET_PLANET_BASEMAPS:
      return {
        ...state,
        data: action.payload || [],
        fetching: false
      };
    case SET_FETCHING:
      return { ...state, fetching: true };
    default:
      return state;
  }
}

// Action Creators
export function getPlanetBasemaps() {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: SET_FETCHING
    });

    return basemapService
      .getPlanetBasemaps()
      .then(data => {
        dispatch({
          type: SET_PLANET_BASEMAPS,
          payload: getFriendlyPlanetBasemaps(data.mosaics)
        });
      })
      .catch(error => {
        console.warn(error);
      });
  };
}
