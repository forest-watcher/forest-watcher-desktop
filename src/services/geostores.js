import { API_VIZZUALITY_URL_V1 } from "../constants/global";
import { BaseService } from "./baseService";

export class GEOStoreService extends BaseService {
  saveGeoStore(geojson) {
    const body = JSON.stringify({
      geojson: geojson
    });

    return this.fetchJSON("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    });
  }

  getGeostore(id) {
    return this.fetchJSON(`/${id}`);
  }
}

export const geoStoreService = new GEOStoreService(`${API_VIZZUALITY_URL_V1}/geostore`);
