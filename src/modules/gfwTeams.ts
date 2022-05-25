import { teamService } from "services/teams";
import { apiService } from "../services/api";
import { RootState, AppDispatch } from "index";
import type { TGetUserTeamsResponse, TGetTeamMembersResponse, TGetMyTeamInvites } from "services/teams";

const GET_USER_TEAMS = "gfwTeams/GET_USER_TEAMS";
const GET_TEAM_MEMBERS = "gfwTeams/GET_TEAM_MEMBERS";
const GET_MY_TEAM_INVITES = "gfwTeams/GET_MY_TEAM_INVITES";
const GET_TEAM_AREAS = "gfwTeams/GET_TEAM_AREAS";

export type TGFWTeamsState = {
  data: TGetUserTeamsResponse["data"];
  members: { [teamId: string]: TGetTeamMembersResponse["data"] };
  areas: { [teamId: string]: any }; // ToDo: Change any to TGetAreasByTeamId["data"] when docs are upto date!
  myInvites: TGetMyTeamInvites["data"];
};

export type TReducerActions =
  | { type: typeof GET_USER_TEAMS; payload: { teams: TGFWTeamsState["data"] } }
  | { type: typeof GET_TEAM_MEMBERS; payload: { teamId: string; members: TGFWTeamsState["members"][string] } }
  | { type: typeof GET_MY_TEAM_INVITES; payload: { myInvites: TGFWTeamsState["data"] } }
  // ToDo: Change any to TGetAreasByTeamId["data"] when docs are upto date!
  | { type: typeof GET_TEAM_AREAS; payload: { teamId: string; areas: any } };

const initialState: TGFWTeamsState = {
  data: [],
  members: {},
  areas: {},
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
    case GET_TEAM_AREAS: {
      const teamAreas = {
        ...state.areas,
        [action.payload.teamId]: action.payload.areas
      };
      return Object.assign({}, state, { areas: teamAreas });
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

export const getTeamAreas = (teamId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  apiService.token = getState().user.token;

  apiService
    .getAreasByTeamId(teamId)
    .then(({ data }) =>
      dispatch({
        type: GET_TEAM_AREAS,
        payload: {
          teamId: teamId,
          areas: data
        }
      })
    )
    .catch(error => {
      console.warn("error", error);
    });
};
