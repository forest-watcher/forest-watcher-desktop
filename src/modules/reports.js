import FileSaver from "file-saver";
import normalize from "json-api-normalizer";
import { toastr } from "react-redux-toastr";
import { reportService } from "services/reports";

// Actions
const GET_USER_ANSWERS = "reports/GET_USER_ANSWERS";
const SET_LOADING_REPORTS = "reports/SET_LOADING_REPORTS";

// Reducer
const initialState = {
  answers: {},
  loading: false
};

export default function reducer(state = initialState, action) {
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
    case SET_LOADING_REPORTS:
      return Object.assign({}, state, { loading: action.payload });
    default:
      return state;
  }
}

export function getReports(reportId) {
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_REPORTS,
      payload: true
    });

    reportService.setToken(state().user.token);
    return reportService
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

export function downloadAnswers(reportId) {
  try {
    const isFileSaverSupported = !!new Blob();
    if (isFileSaverSupported) {
      return (dispatch, state) => {
        reportService.setToken(state().user.token);
        return reportService
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
