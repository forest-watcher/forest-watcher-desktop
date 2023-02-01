import { getUser } from "./user";
import { getPlanetBasemaps } from "./map";

// Actions
export const USER_CHECKED = "app/USER_CHECKED";
export const SET_LOCALE = "app/SET_LOCALE";

// Reducer
const initialState = {
  userChecked: false,
  locale: "en"
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_CHECKED:
      return Object.assign({}, state, { userChecked: true });
    case SET_LOCALE:
      return Object.assign({}, state, { locale: action.payload });
    default:
      return state;
  }
}

// Action Creators
export function syncApp() {
  return async (dispatch, state) => {
    dispatch(getUser());
    // fetch planet base maps
    dispatch(getPlanetBasemaps());
  };
}

export function setUserChecked() {
  return {
    type: USER_CHECKED
  };
}

export function setLocale(locale) {
  return {
    type: SET_LOCALE,
    payload: locale
  };
}
