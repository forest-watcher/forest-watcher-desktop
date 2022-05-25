import { API_BASE_URL_V1, API_BASE_URL_V3 } from "../constants/global";
import { BaseService } from "./baseService";
import { unique } from "../helpers/utils";
import { components, paths } from "interfaces/teams";

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
}

export const legacy_TeamService = new Legacy_TeamService(`${API_BASE_URL_V1}/teams`);

export const teamService = new TeamService(`${API_BASE_URL_V3}/teams`);
