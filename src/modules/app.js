import { getGeostore } from "./geostores";
import { getAreas, getAreasInUsersTeams } from "./areas";
import { getTeamByUserId } from "./teams";
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
    // fetch all areas and their geostores
    const user = state().user.data;
    dispatch(getUser());
    dispatch(getTeamByUserId(user.id));
    await dispatch(getAreas());
    let areaPromises = [];
    const areasIds = state().areas.ids;
    const areas = state().areas.data;
    areasIds.forEach(id => {
      areaPromises.push(dispatch(getGeostore(areas[id].attributes.geostore.id)));
    });
    await Promise.all(areaPromises);

    // Fetch all team user areas
    dispatch(getAreasInUsersTeams());

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
