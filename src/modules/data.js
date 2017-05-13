// Actions
const GET_USER_AREAS = 'areas/GET_AREAS';
const GET_USER_REPORTS = 'areas/GET_REPORTS';
const GET_USER_QUESTIONAIRES = 'areas/GET_USER_QUESTIONAIRES';

// Reducer
const initialState = {
  areas: {},
  reports: {},
  questionaires: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_AREAS:
      if (action.payload) {
        return Object.assign({}, state, { areas: action.payload });
      }
      return state;
    case GET_USER_REPORTS:
      if (action.payload.data) {
        return Object.assign({}, state, { reports: action.payload.data });
      }
      return state;
    case GET_USER_QUESTIONAIRES:
    if (action.payload) {
      return Object.assign({}, state, { questionaires: action.payload });
    }
    return state;
    default:
      return state;
  }
}

export function getUserAreas() {
  const url = `${process.env.REACT_APP_API_AUTH}/area`;
  return (dispatch, state) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_USER_AREAS,
          payload: data.data
        });
      })
      .catch((error) => {
        console.info(error);
        // To-do
      });
  };
}

export function getUserReports() {
  const url = `${process.env.REACT_APP_API_AUTH}/questionnaire`;
  return (dispatch, state) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_USER_REPORTS,
          payload: data
        });
      })
      .catch((error) => {
        console.info(error);
        // To-do
      });
  };
}

export function getUserQuestionaires() {
  const url = `${process.env.REACT_APP_API_AUTH}/questionnaire`;
  return (dispatch, state) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${state().user.token}`
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_USER_QUESTIONAIRES,
          payload: data
        });
      })
      .catch((error) => {
        console.info(error);
        // To-do
      });
  };
}
