import { parseLayer } from "helpers/layer";
import { API_BASE_URL } from "../constants/global";
import { BaseService } from "./baseService";

export class LayerService extends BaseService {
  setToken(token) {
    this.token = token;
  }

  createLayer(layer, teamId) {
    let url = teamId ? `/team/${teamId}` : `/`;

    return this.fetchJSON(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(parseLayer(layer))
    });
  }

  getLayers() {
    return this.fetchJSON("/", {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  toggleLayer(layerId, value) {
    return this.fetchJSON(`/${layerId}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify({ enabled: value })
    });
  }

  deleteLayer(layerId) {
    return this.fetch(`/${layerId}`, {
      method: "DELETE"
    });
  }
}

export const layerService = new LayerService(`${API_BASE_URL}/v1/contextual-layer`);
