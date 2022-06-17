import { API_BASE_URL_V3 } from "../constants/global";
import { BLOB_CONFIG } from "../constants/map";
import { BaseService } from "./baseService";
import domtoimage from "dom-to-image";
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
  async saveArea(area: any, node: HTMLElement, method: string) {
    const url = method === "PATCH" ? `/${area.id}` : `/`;
    const blob = await domtoimage.toBlob(node, BLOB_CONFIG);

    const image = new File([blob], `${encodeURIComponent(area.name)}.png`, { type: "image/png" });
    const body = new FormData();
    body.append("name", area.name);
    body.append("geostore", area.geostore);
    body.append("geojson", JSON.stringify(area.geojson));
    body.append("image", image);

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
    const promises = templateIds.map(id => this.fetch(`/${areaId}/template/${id}`, { method: "POST" }));

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
    const promises = teamIds.map(id => this.fetch(`/${areaId}/team/${id}`, { method: "POST" }));

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
