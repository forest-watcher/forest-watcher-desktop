import { API_BASE_URL_V3 } from "../constants/global";
import { BaseService } from "./baseService";
import { operations } from "interfaces/api";
import store from "store";
import { TeamResponse, teamService } from "./teams";

export type TAreasResponse =
  operations["get-v3-forest-watcher-area"]["responses"]["200"]["content"]["application/json"];

export type TTeamAreaResponse = {
  data: string[];
};

export type TAreaTeamResponse =
  operations["get-v3-forest-watcher-area-areaTeams"]["responses"]["200"]["content"]["application/json"];

export type TAreasInTeam = {
  team: TeamResponse["data"];
  areas: { data: TAreasResponse }[];
};

export class AreaService extends BaseService {
  async saveArea(area: any, node: HTMLCanvasElement, method: string) {
    const url = method === "PATCH" ? `/${area.id}` : `/`;
    const dataUrl = node.toDataURL("image/jpeg");
    const blob = await (await fetch(dataUrl)).blob();

    const body = new FormData();

    if (blob) {
      const image = new File([blob], `${encodeURIComponent(area.name)}.jpg`, { type: "image/jpeg" });
      body.append("image", image);
    }

    if (area.name) {
      body.append("name", area.name);
    }

    if (area.geostore) {
      body.append("geostore", area.geostore);
    }

    if (area.geojson) {
      body.append("geojson", JSON.stringify(area.geojson));
    }

    if (method === "POST") {
      body.append("application", "fw-web");
    }

    return this.fetchJSON(url, {
      method,
      body
    });
  }

  getArea(id: string): Promise<any> {
    return this.fetchJSON(`/${id}`);
  }

  async getAreasInUsersTeams(): Promise<TAreasInTeam[]> {
    // Get teams
    const teams = await teamService.getUserTeams(store.getState().user.data.id);

    return Promise.all(
      teams.data.map(async (team: TeamResponse["data"]) => {
        if (team) {
          const resp: TTeamAreaResponse = await this.fetchJSON(`/teamAreas/${team.id}`);
          return { team, areas: await Promise.all(resp.data.map(id => this.getArea(id))) };
        }

        return { team, areas: [] };
      })
    );
  }

  getAreaFW(): Promise<TAreasResponse> {
    return this.fetchJSON("/");
  }

  deleteArea(id: string) {
    return this.fetch(`/${id}`, { method: "DELETE" });
  }

  addTemplatesToAreas(areaId: string, templateIds: string[]) {
    this.token = store.getState().user.token;
    const promises = templateIds.map(async id => {
      const resp = await this.fetch(`/${areaId}/template/${id}`, { method: "POST" });
      if (!resp.ok) {
        throw Error(await resp.text());
      }
      return resp;
    });

    return Promise.all(promises);
  }

  unassignTemplateFromArea(areaId: string, templateId: string) {
    this.token = store.getState().user.token;
    return this.fetch(`/${areaId}/template/${templateId}`, { method: "DELETE" });
  }

  unassignTeamFromArea(areaId: string, teamId: string) {
    this.token = store.getState().user.token;
    return this.fetch(`/${areaId}/team/${teamId}`, { method: "DELETE" });
  }

  getAreaTeamIds(areaId: string) {
    this.token = store.getState().user.token;
    return this.fetchJSON(`/areaTeams/${areaId}`);
  }

  addTeamsToAreas(areaId: string, teamIds: string[]) {
    this.token = store.getState().user.token;
    const promises = teamIds.map(async id => {
      const resp = await this.fetch(`/${areaId}/team/${id}`, { method: "POST" });
      if (!resp.ok) {
        throw Error(await resp.text());
      }
      return resp;
    });

    return Promise.all(promises);
  }

  async getAreaTeams(areaId: string) {
    this.token = store.getState().user.token;
    const resp = await this.getAreaTeamIds(areaId);
    if (resp.data) {
      // For each team id get the team..
      return await Promise.all(resp.data.map((id: string) => teamService.getTeam(id)));
    }

    return [];
  }
}

export const areaService = new AreaService(`${API_BASE_URL_V3}/forest-watcher/area`);
