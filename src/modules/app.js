import { getGeostore } from "./geostores";
import { getAreas, getAreasInUsersTeams } from "./areas";
import { getTemplate, getTemplates } from "./templates";
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
    let teamTemplateIds = [];
    const areasIds = state().areas.ids;
    const areas = state().areas.data;
    areasIds.forEach(id => {
      areaPromises.push(dispatch(getGeostore(areas[id].attributes.geostore.id)));
      if (areas[id].attributes.templateId) {
        teamTemplateIds.push(areas[id].attributes.templateId);
      }
    });
    await Promise.all(areaPromises);
    // Fetch all team user areas
    dispatch(getAreasInUsersTeams());

    // fetch all user templates
    await dispatch(getTemplates());

    // fetch planet base maps
    dispatch(getPlanetBasemaps());

    // fetch any missing team templates
    let templatePromises = [];
    const templateIds = state().templates.ids;
    teamTemplateIds.forEach(id => {
      if (templateIds.indexOf(id) === -1) {
        templatePromises.push(dispatch(getTemplate(id)));
      }
    });
    await Promise.all(templatePromises);
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
