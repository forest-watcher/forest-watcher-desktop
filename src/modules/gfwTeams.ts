import { teamService } from "services/teams";
import { RootState, AppDispatch } from "index";
import { TGetUserTeamsResponse, TGetTeamMembersResponse, TGetMyTeamInvites } from "services/teams";

const GET_USER_TEAMS = "gfwTeams/GET_USER_TEAMS";
const GET_TEAM_MEMBERS = "gfwTeams/GET_TEAM_MEMBERS";
const GET_MY_TEAM_INVITES = "gfwTeams/GET_MY_TEAM_INVITES";

export type TGFWTeamsState = {
  data: TGetUserTeamsResponse["data"];
  members: { [teamId: string]: TGetTeamMembersResponse["data"] };
  myInvites: TGetMyTeamInvites["data"];
};

export type TReducerActions =
  | { type: typeof GET_USER_TEAMS; payload: { teams: TGFWTeamsState["data"] } }
  | { type: typeof GET_TEAM_MEMBERS; payload: { teamId: string; members: TGFWTeamsState["members"][string] } }
  | { type: typeof GET_MY_TEAM_INVITES; payload: { myInvites: TGFWTeamsState["data"] } };

const initialState: TGFWTeamsState = {
  data: [],
  members: {},
  myInvites: []
};

export default function reducer(state = initialState, action: TReducerActions) {
  switch (action.type) {
    case GET_USER_TEAMS: {
      return Object.assign({}, state, { data: action.payload.teams });
    }
    case GET_TEAM_MEMBERS: {
      const teamMembers = {
        ...state.members,
        [action.payload.teamId]: action.payload.members
      };

      return Object.assign({}, state, { members: teamMembers });
    }
    case GET_MY_TEAM_INVITES: {
      return Object.assign({}, state, { myInvites: action.payload.myInvites });
    }
    default:
      return state;
  }
}

// Actions
export const getUserTeams = (userId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  teamService.token = getState().user.token;

  teamService
    .getUserTeams(userId)
    .then(({ data }) =>
      dispatch({
        type: GET_USER_TEAMS,
        payload: { teams: data }
      })
    )
    .catch(error => {
      console.warn("error", error);
    });
};

export const getTeamMembers = (teamId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  teamService.token = getState().user.token;

  teamService
    .getTeamMembers(teamId)
    .then(({ data }) =>
      dispatch({
        type: GET_TEAM_MEMBERS,
        payload: {
          teamId: teamId,
          members: data
        }
      })
    )
    .catch(error => {
      console.warn("error", error);
    });
};

export const getMyTeamInvites = () => (dispatch: AppDispatch, getState: () => RootState) => {
  teamService.token = getState().user.token;

  teamService
    .getMyTeamInvites()
    .then(({ data }) =>
      dispatch({
        type: GET_MY_TEAM_INVITES,
        payload: {
          myInvites: data
        }
      })
    )
    .catch(error => {
      console.warn("error", error);
    });
};
