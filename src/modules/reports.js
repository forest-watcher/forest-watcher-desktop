import normalize from 'json-api-normalizer';
import { API_BASE_URL } from '../constants';

// Actions
const GET_USER_REPORTS = 'reports/GET_REPORTS';
const SET_LOADING_REPORTS = 'reports/SET_LOADING_REPORTS';
const SET_LOADING_REPORTS_ERROR = 'reports/SET_LOADING_REPORTS_ERROR';

// Reducer
const initialState = {
  ids: [],
  report: {},
  loading: false,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_REPORTS: {
      const { report } = action.payload;
      if (report) return Object.assign({}, state, { ids: Object.keys(report), report });
      return state;
    }
    case SET_LOADING_REPORTS:
      return Object.assign({}, state, { loading: action.payload });
    case SET_LOADING_REPORTS_ERROR:
      return Object.assign({}, state, { error: action.payload });
    default:
      return state;
  }
}

// Action Creators
export function getUserReports() {
  const url = `${API_BASE_URL}/questionnaire`;
  return (dispatch, state) => {
    dispatch({
      type: SET_LOADING_REPORTS,
      payload: true
    });
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        const normalized = normalize(data);
        dispatch({
          type: GET_USER_REPORTS,
          payload: normalized
        });
        dispatch({
          type: SET_LOADING_REPORTS,
          payload: false
        });
      })
      .catch((error) => {
        dispatch({
          type: SET_LOADING_REPORTS_ERROR,
          payload: error
        });
        dispatch({
          type: SET_LOADING_REPORTS,
          payload: false
        });
      });
  };
}