import { API_BASE_URL_V3 } from "../constants/global";
import { BLOB_CONFIG } from "../constants/map";
import { BaseService } from "./baseService";
import domtoimage from "dom-to-image";
import { operations } from "interfaces/api";
import store from "store";

export type TAreasResponse =
  operations["get-v3-forest-watcher-area"]["responses"]["200"]["content"]["application/json"];

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

  getArea(id: string) {
    return this.fetchJSON(`/${id}`);
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

  getAreaTeamIds(areaId: string) {
    this.token = store.getState().user.token;
    return this.fetchJSON(`/areaTeams/${areaId}`);
  }

  async getAreaTeams(areaId: string) {
    this.token = store.getState().user.token;
    const resp = await this.getAreaTeamIds(areaId);
    if (resp.data) {
      console.log(resp);
    }

    return [];
  }
}

export const areaService = new AreaService(`${API_BASE_URL_V3}/forest-watcher/area`);
