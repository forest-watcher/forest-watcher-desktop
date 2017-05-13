import { replace } from 'react-router-redux';

// Actions
export const USER_CHECKED = 'app/USER_CHECKED';

// Reducer
const initialState = {
  userChecked: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_CHECKED:
      return Object.assign({}, state, { userChecked: true });
    default:
      return state;
  }
}

// Action Creators
export function setUserChecked() {
  return {
    type: USER_CHECKED
  };
}
