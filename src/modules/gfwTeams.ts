import { teamService } from "services/teams";
import { RootState, AppDispatch } from "index";
import { TGetUserTeamsResponse } from "services/teams";

const GET_USER_TEAMS = "gfwTeams/GET_USER_TEAMS";

type TState = {
  data?: TGetUserTeamsResponse["data"];
};

const initialState: TState = {
  data: undefined
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case GET_USER_TEAMS: {
      state.data = action.payload;

      break;
    }
    default:
      return state;
  }
}

// Actions
export const getUserTeams = (userId: string) => (dispatch: AppDispatch, state: RootState) => {
  teamService.token = state.user.token;

  teamService
    .getUserTeams(userId)
    .then(({ data }) =>
      dispatch({
        type: GET_USER_TEAMS,
        payload: data
      })
    )
    .catch(error => {
      console.warn("error", error);
    });
};
