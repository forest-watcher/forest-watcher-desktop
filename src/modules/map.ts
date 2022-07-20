import { AppDispatch } from "store";
import { basemapService, IMosaic } from "services/basemap";

// Actions
const SET_PLANET_BASEMAPS = "map/SET_PLANET_BASEMAPS";
const SET_FETCHING = "map/SET_FETCHING";

export type TMapState = {
  data: IMosaic[];
  fetching: boolean;
};

// Reducer
const initialState: TMapState = {
  data: [],
  fetching: false
};

export type TReducerActions =
  | { type: typeof SET_PLANET_BASEMAPS; payload: IMosaic[] }
  | { type: typeof SET_FETCHING; payload: any };

export default function reducer(state = initialState, action: TReducerActions): TMapState {
  switch (action.type) {
    case SET_PLANET_BASEMAPS:
      console.log({ payload: action.payload });
      return {
        ...state,
        data: action.payload.filter(item => item.datatype === "byte"),
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
          payload: data.mosaics
        });
      })
      .catch(error => {
        console.warn(error);
      });
  };
}
