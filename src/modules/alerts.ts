import { AppDispatch, RootState } from "store";
import { alertsService } from "services/alerts";

const SET_ALERTS_FOR_AREA = "alerts/SET_ALERTS_FOR_AREA";

type TAlertsState = {
  [areaId: string]: any;
};

type TReducerActions = {
  type: typeof SET_ALERTS_FOR_AREA;
  payload: {
    areaId: string;
    alerts: any;
  };
};

const initialState: TAlertsState = {};

export default function reducer(state = initialState, action: TReducerActions): TAlertsState {
  switch (action.type) {
    case SET_ALERTS_FOR_AREA:
      return {
        ...state,
        [action.payload.areaId]: action.payload.alerts
      };
    default:
      return state;
  }
}

export const getAlertsForArea = (area: any) => (dispatch: AppDispatch, getState: () => RootState) => {
  alertsService
    .getAlertsForArea(area)
    .then(alerts => {
      dispatch({
        type: SET_ALERTS_FOR_AREA,
        payload: {
          areaId: area.id,
          alerts
        }
      });
    })
    .catch(() => {
      // ToDo
    });
};

export const getAlertsForAreas = (areas: any[]) => (dispatch: AppDispatch, getState: () => RootState) => {
  for (const area of areas) {
    alertsService.getAlertsForArea(area).then(alerts => {
      dispatch({
        type: SET_ALERTS_FOR_AREA,
        payload: {
          areaId: area.id,
          alerts
        }
      });
    });
  }
};
