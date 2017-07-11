import { CARTO_URL } from '../constants/global';

// Actions
const GET_LAYERS = 'layers/GET_LAYERS';

// Reducer
const initialState = {
  gfw: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_LAYERS: {
      if (action.payload) {
        return Object.assign({}, state, { gfw: action.payload });
      }
      return state;
    }
    default:
      return state;
  }
}

// Action Creators
export function getLayers() {
  const url = `${CARTO_URL}/api/v2/sql?q=SELECT title, tileurl FROM layerspec WHERE tileurl is not NULL AND tileurl <> ''`;
  return (dispatch, state) => {
    fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      throw Error(response.statusText);
    })
    .then(async (data) => {
      dispatch({
        type: GET_LAYERS,
        payload: data.rows
      });
    })
    .catch((error) => {
      console.warn(error);
    });
  };
}