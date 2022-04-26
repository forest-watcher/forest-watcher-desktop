import { API_BASE_URL_V1 } from "../constants/global";
import { BaseService } from "./baseService";
import { unique } from "../helpers/utils";

export class TeamService extends BaseService {
  setToken(token) {
    this.token = token;
  }

  saveTeam(team, locale, teamId) {
    const body = JSON.stringify({
      name: team.name,
      managers: team.managers.filter(unique),
      confirmedUsers: team.confirmedUsers.filter(unique),
      users: team.users.filter(unique),
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

  getTeam(userId) {
    return this.fetchJSON(`/user/${userId}`);
  }

  confirmTeamMember(token) {
    return this.fetch(`/confirm/${token}`);
  }
}

export const teamService = new TeamService(`${API_BASE_URL_V1}/teams`);
