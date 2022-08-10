import { API_BASE_URL_V3 } from "constants/global";
import { paths } from "interfaces/exports";
import { BaseService } from "./baseService";
import store from "store";

export type TExportAllAreasResponse =
  paths["/v3/areas/exportAll"]["post"]["responses"]["200"]["content"]["application/json"];

export type TExportOneAreaResponse =
  paths["/v3/areas/exportOne/{areaId}"]["post"]["responses"]["200"]["content"]["application/json"];

export class ExportSerive extends BaseService {
  exportAllAreas(fileType: string): Promise<TExportAllAreasResponse> {
    this.token = store.getState().user.token;

    const body = {
      fileType,
      fields: []
    };

    return this.fetchJSON(`/areas/exportAll`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  exportAllReports(fileType: string): Promise<TExportAllAreasResponse> {
    this.token = store.getState().user.token;

    const body = {
      fileType,
      fields: ["areaOfInterestName", "reportName"],
      language: "en"
    };

    return this.fetchJSON(`/reports/exportAll`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  exportArea(id: string, fileType: string): Promise<TExportOneAreaResponse> {
    this.token = store.getState().user.token;

    const body = {
      fileType,
      fields: []
    };

    return this.fetchJSON(`/areas/exportOne/${id}`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }
}

export const exportService = new ExportSerive(`${API_BASE_URL_V3}/exports`);
