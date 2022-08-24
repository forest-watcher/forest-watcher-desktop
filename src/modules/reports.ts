// @ts-ignore missing types
import FileSaver from "file-saver";
// @ts-ignore missing types
import normalize from "json-api-normalizer";
import { toastr } from "react-redux-toastr";
import { legacy_reportService, reportService, TGetAllAnswers } from "services/reports";
import { AppDispatch, RootState } from "store";

// Actions
const GET_USER_ANSWERS = "reports/GET_USER_ANSWERS";
const GET_ALL_ANSWERS = "reports/GET_ALL_ANSWERS";
const SET_LOADING_REPORTS = "reports/SET_LOADING_REPORTS";

export type TReducerActions =
  | { type: typeof GET_USER_ANSWERS; payload: any }
  | { type: typeof GET_ALL_ANSWERS; payload: TGetAllAnswers["data"] }
  | { type: typeof SET_LOADING_REPORTS; payload: boolean };

export type TReportsState = {
  answers: any;
  allAnswers: TGetAllAnswers["data"];
  loading: boolean;
};

// Reducer
const initialState: TReportsState = {
  answers: {},
  allAnswers: [],
  loading: false
};

export default function reducer(state = initialState, action: TReducerActions): TReportsState {
  switch (action.type) {
    case GET_USER_ANSWERS: {
      const reportId = action.payload.reportId;
      const answers = action.payload.data.answers || [];
      const updatedAnswers = {
        ...state.answers,
        [reportId]: {
          ids: [...Object.keys(answers)],
          data: { ...answers }
        }
      };
      return { ...state, answers: updatedAnswers };
    }
    case GET_ALL_ANSWERS:
      return Object.assign({}, state, { allAnswers: action.payload ?? [] });
    case SET_LOADING_REPORTS:
      return Object.assign({}, state, { loading: action.payload });
    default:
      return state;
  }
}

export function getAllReports() {
  return (dispatch: AppDispatch, state: () => RootState) => {
    if (!state().reports.loading) {
      dispatch({
        type: SET_LOADING_REPORTS,
        payload: true
      });

      reportService.token = state().user.token;
      return reportService
        .getAnswers()
        .then(({ data }) => {
          dispatch({
            type: GET_ALL_ANSWERS,
            payload: data
          });
          dispatch({
            type: SET_LOADING_REPORTS,
            payload: false
          });
        })
        .catch(error => {
          dispatch({
            type: SET_LOADING_REPORTS,
            payload: false
          });
        });
    }
  };
}

export function getReports(reportId: string) {
  return (dispatch: AppDispatch, state: () => RootState) => {
    dispatch({
      type: SET_LOADING_REPORTS,
      payload: true
    });

    legacy_reportService.token = state().user.token;
    return legacy_reportService
      .getAnswers(reportId)
      .then(data => {
        const normalized = {
          reportId: reportId,
          data: normalize(data)
        };
        dispatch({
          type: GET_USER_ANSWERS,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_REPORTS,
          payload: false
        });
      })
      .catch(error => {
        dispatch({
          type: SET_LOADING_REPORTS,
          payload: false
        });
      });
  };
}

export function downloadAnswers(reportId: string) {
  try {
    const isFileSaverSupported = !!new Blob();
    if (isFileSaverSupported) {
      return (dispatch: AppDispatch, state: () => RootState) => {
        legacy_reportService.token = state().user.token;
        return legacy_reportService
          .downloadAnswers(reportId)
          .then(data => {
            FileSaver.saveAs(data, `${reportId}-answers.csv`);
          })
          .catch(error => {
            toastr.error("Unable to download reports", error);
          });
      };
    }
    return null;
  } catch (e) {
    console.warn("File download not supported");
    return null;
  }
}
