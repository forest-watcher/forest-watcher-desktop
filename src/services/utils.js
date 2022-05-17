import { CARTO_COUNTRIES } from "../constants/global";
import { API_VIZZUALITY_URL_V1 } from "../constants/global";
import { BaseService } from "./baseService";

export class UtilsService extends BaseService {
  getCountries() {
    const url = `${CARTO_COUNTRIES}`;
    return this.fetchJSON(url);
  }

  getGeoJSONFromShapeFile(token, shapefile) {
    const url = `${API_VIZZUALITY_URL_V1}/ogr/convert`;
    this.token = token;

    const body = new FormData();
    body.append("file", shapefile);

    return this.fetchJSON(url, {
      method: "POST",
      body
    });
  }
}

export const utilsService = new UtilsService("");
