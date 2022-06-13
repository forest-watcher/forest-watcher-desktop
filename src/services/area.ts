import { API_BASE_URL_V3 } from "../constants/global";
import { BLOB_CONFIG } from "../constants/map";
import { BaseService } from "./baseService";
import domtoimage from "dom-to-image";
import { operations } from "interfaces/api";

type AreasResponse = operations["get-v3-forest-watcher-area"]["responses"]["200"]["content"]["application/json"];

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

  getAreaFW(): Promise<AreasResponse> {
    return this.fetchJSON("/");
  }

  deleteArea(id: string) {
    return this.fetch(`/${id}`, { method: "DELETE" });
  }
}

export const areaService = new AreaService(`${API_BASE_URL_V3}/forest-watcher/area`);
