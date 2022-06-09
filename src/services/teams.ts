import { API_BASE_URL_V1, API_BASE_URL_V3 } from "../constants/global";
import { BaseService } from "./baseService";
import { unique } from "../helpers/utils";
import { components, paths } from "interfaces/teams";
import { store } from "index";

type TeamResponse = components["responses"]["Team"]["content"]["application/json"];
export type Team = components["schemas"]["Team"];

export class Legacy_TeamService extends BaseService {
  saveTeam(team: Team, locale: any, teamId?: string) {
    const body = JSON.stringify({
      name: team.name,
      managers: team.managers?.filter(unique) || [],
      confirmedUsers: team.confirmedUsers?.filter(unique) || [],
      users: team.users?.filter(unique) || [],
      areas: team.areas,
      locale: locale
    });

    return this.fetchJSON(teamId ? `/${teamId}` : "/", {
      headers: {
        "Content-Type": "application/json"
      },
      method: teamId ? "PATCH" : "POST",
      body
    });
  }

  getTeamByUserId(userId: string): Promise<TeamResponse> {
    return this.fetchJSON(`/user/${userId}`);
  }

  getTeamById(id: string): Promise<TeamResponse> {
    return this.fetchJSON(`/${id}`);
  }

  confirmTeamMember(token: string) {
    return this.fetch(`/confirm/${token}`);
  }
}

export type TGetUserTeamsResponse =
  paths["/v3/teams/user/{userId}"]["get"]["responses"]["200"]["content"]["application/json"];

export type TGetTeamMembersResponse =
  paths["/v3/teams/{teamId}/users"]["get"]["responses"]["200"]["content"]["application/json"];

export type TGetMyTeamInvites = paths["/v3/teams/myinvites"]["get"]["responses"]["200"]["content"]["application/json"];
export type TPostTeamResponse = paths["/v3/teams"]["post"]["responses"]["200"]["content"]["application/json"];
export type TPatchTeamResponse =
  paths["/v3/teams/{teamId}"]["patch"]["responses"]["200"]["content"]["application/json"];
// ToDo: Docs shouldn't include createdAt as a required request object!
export type TPostTeamBody = Omit<paths["/v3/teams"]["post"]["requestBody"]["content"]["application/json"], "createdAt">;
// ToDo: Docs shouldn't include createdAt as a required request object!
export type TPatchTeamBody = Omit<
  paths["/v3/teams/{teamId}"]["patch"]["requestBody"]["content"]["application/json"],
  "createdAt"
>;
export type TDeleteTeamResponse = paths["/v3/teams/{teamId}"]["delete"]["responses"]["200"];
export type TPostTeamMembersBody =
  paths["/v3/teams/{teamId}/users"]["post"]["requestBody"]["content"]["application/json"];
export type TPostTeamMembersResponse =
  paths["/v3/teams/{teamId}/users"]["post"]["responses"]["200"]["content"]["application/json"];

export type TPatchTeamMembersParams = paths["/v3/teams/{teamId}/users/{teamUserId}"]["patch"]["parameters"]["path"];
export type TPatchTeamMembersBody =
  paths["/v3/teams/{teamId}/users/{teamUserId}"]["patch"]["requestBody"]["content"]["application/json"];
export type TPatchTeamMembersResponse =
  paths["/v3/teams/{teamId}/users/{teamUserId}"]["patch"]["responses"]["200"]["content"]["application/json"];

export type TDeleteTeamMembersParams = paths["/v3/teams/{teamId}/users/{teamUserId}"]["delete"]["parameters"]["path"];
export type TDeleteTeamMembersResponse =
  paths["/v3/teams/{teamId}/users/{teamUserId}"]["delete"]["responses"]["200"]["content"]["application/json"];

export class TeamService extends BaseService {
  getUserTeams(userId: string): Promise<TGetUserTeamsResponse> {
    return this.fetchJSON(`/user/${userId}`);
  }

  getTeamMembers(teamId: string): Promise<TGetTeamMembersResponse> {
    return this.fetchJSON(`/${teamId}/users`);
  }

  getMyTeamInvites(): Promise<TGetMyTeamInvites> {
    return this.fetchJSON("/myinvites");
  }

  createTeam(body: TPostTeamBody): Promise<TPostTeamResponse> {
    this.token = store.getState().user.token;

    return this.fetchJSON("/", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  updateTeam(teamId: string, body: TPatchTeamBody): Promise<TPatchTeamResponse> {
    this.token = store.getState().user.token;

    return this.fetchJSON(`/${teamId}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify(body)
    });
  }

  deleteTeam(teamId: string): Promise<TDeleteTeamResponse> {
    this.token = store.getState().user.token;

    return this.fetch(`/${teamId}`, {
      method: "DELETE"
    });
  }

  addTeamMembers(teamId: string, body: TPostTeamMembersBody): Promise<TPostTeamMembersResponse> {
    this.token = store.getState().user.token;

    return this.fetchJSON(`/${teamId}/users`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  updateTeamMember(params: TPatchTeamMembersParams, body: TPatchTeamMembersBody): Promise<TPatchTeamMembersResponse> {
    this.token = store.getState().user.token;

    return this.fetchJSON(`/${params.teamId}/users/${params.teamUserId}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify(body)
    });
  }

  removeTeamMember(params: TDeleteTeamMembersParams): Promise<TDeleteTeamMembersResponse> {
    this.token = store.getState().user.token;

    return this.fetchJSON(`/${params.teamId}/users/${params.teamUserId}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "DELETE"
    });
  }
}

export const legacy_TeamService = new Legacy_TeamService(`${API_BASE_URL_V1}/teams`);

export const teamService = new TeamService(`${API_BASE_URL_V3}/teams`);
