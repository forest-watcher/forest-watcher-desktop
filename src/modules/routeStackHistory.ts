import { Location } from "history";

// Actions
export const ADD_TO_HISTORY = "routeHistory/ADD_TO_HISTORY";

export type TRouteStackHistoryState = {
  stackHistory: Location[];
};

// Reducer
const initialState: TRouteStackHistoryState = {
  stackHistory: []
};

export type TReducerActions = { type: typeof ADD_TO_HISTORY; payload: Location };

export default function reducer(state = initialState, action: TReducerActions): TRouteStackHistoryState {
  switch (action.type) {
    case ADD_TO_HISTORY: {
      if (!state.stackHistory.find(item => item.key === action.payload.key)) {
        return {
          ...state,
          stackHistory: [...state.stackHistory, action.payload]
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
