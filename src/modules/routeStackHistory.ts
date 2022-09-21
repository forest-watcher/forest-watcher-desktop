import { Location } from "history";

// Actions
export const ROUTER_HISTORY_POP = "routeHistory/POP";
export const ROUTER_HISTORY_PUSH = "routeHistory/PUSH";
export const ROUTER_HISTORY_REPLACE = "routeHistory/REPLACE";

export type TRouteStackHistoryState = {
  stackHistory: Location[];
};

// Reducer
const initialState: TRouteStackHistoryState = {
  stackHistory: []
};

export type TReducerActions = { type: string; payload: Location };

export default function reducer(state = initialState, action: TReducerActions): TRouteStackHistoryState {
  switch (action.type) {
    case ROUTER_HISTORY_PUSH: {
      if (!state.stackHistory.find(item => item.key === action.payload.key)) {
        return {
          ...state,
          stackHistory: [...state.stackHistory, action.payload]
        };
      } else {
        return state;
      }
    }

    case ROUTER_HISTORY_POP: {
      const stackHistory = [...state.stackHistory];
      while (stackHistory.length > 0 && stackHistory[stackHistory.length - 1].key !== action.payload.key) {
        stackHistory.pop();
      }

      return {
        ...state,
        stackHistory
      };
    }

    case ROUTER_HISTORY_REPLACE: {
      if (!state.stackHistory.find(item => item.key === action.payload.key)) {
        const stackHistory = [...state.stackHistory];
        stackHistory[stackHistory.length - 1] = action.payload;

        return {
          ...state,
          stackHistory
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
