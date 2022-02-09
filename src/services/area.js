import { API_BASE_URL } from "../constants/global";
import { BLOB_CONFIG } from "../constants/map";
import { BaseService } from "./baseService";
import domtoimage from "dom-to-image";

export class AreaService extends BaseService {
  setToken(token) {
    this.token = token;
  }

  async saveArea(area, node, method) {
    const url = method === "PATCH" ? `/${area.id}` : `/`;
    const blob = await domtoimage.toBlob(node, BLOB_CONFIG);
    const image = new File([blob], "png", { type: "image/png", name: encodeURIComponent(area.name) });

    const body = new FormData();
    body.append("name", area.name);
    body.append("geostore", area.geostore);
    body.append("image", image);

    return this.fetchJSON(url, {
      method,
      body
    });
  }

  getArea(id) {
    return this.fetchJSON(`/${id}`);
  }

  getAreaFW() {
    return this.fetchJSON("/fw");
  }

  deleteArea(id) {
    return this.fetch(`/${id}`, { method: "DELETE" });
  }
}

export const areaService = new AreaService(`${API_BASE_URL}/area`);
