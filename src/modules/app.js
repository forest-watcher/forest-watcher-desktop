import { getGeostore } from './geostores';
import { getAreas } from './areas';
import { getTemplates, getTemplate } from './templates';
import { getTeam } from './teams';
import { getUser } from './user';

// Actions
export const USER_CHECKED = 'app/USER_CHECKED';
export const SET_LOCALE = 'app/SET_LOCALE';

// Reducer
const initialState = {
  userChecked: false,
  locale: 'en'
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
    dispatch(getTeam(user.id));
    await dispatch(getAreas());
    let areaPromises = [];
    let teamTemplateIds = [];
    const areasIds = state().areas.ids;
    const areas = state().areas.data;
    areasIds.forEach((id) => {
      areaPromises.push(dispatch(getGeostore(areas[id].attributes.geostore)));
      if (areas[id].attributes.templateId) {
        teamTemplateIds.push(areas[id].attributes.templateId);
      }
    });
    await Promise.all(areaPromises);

    // fetch all user templates
    await dispatch(getTemplates());

    // fetch any missing team templates
    let templatePromises = [];
    const templateIds = state().templates.ids;
    teamTemplateIds.forEach((id) => {
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
