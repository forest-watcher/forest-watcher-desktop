import { API_BASE_URL_V3 } from "constants/global";
import { paths } from "interfaces/exports";
import { BaseService } from "./baseService";
import store from "store";
import { TReportsDataTable } from "pages/reports/reports/Reports";

export type TExportAllAreasResponse =
  paths["/v3/exports/areas/exportAll"]["post"]["responses"]["200"]["content"]["application/json"];

export type TExportOneAreaResponse =
  paths["/v3/exports/areas/exportOne/{areaId}"]["post"]["responses"]["200"]["content"]["application/json"];

export type TExportAllReportsResponse =
  paths["/v3/exports/reports/exportAll"]["post"]["responses"]["200"]["content"]["application/json"];

export type TExportSomeReportsResponse =
  paths["/v3/exports/reports/exportSome"]["post"]["responses"]["200"]["content"]["application/json"];

export type TReportResponse =
  paths["/v3/exports/reports/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

function delay(timeInMs: number) {
  return new Promise(resolve => setTimeout(resolve, timeInMs));
}

export class ExportSerive extends BaseService {
  exportAllAreas(fileType: string): Promise<TExportAllAreasResponse> {
    this.token = store.getState().user.token;

    const body = {
      fileType,
      fields: []
    };

    return this.fetchJSON(`/areas/exportAll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  }

  async exportAllReports(fileType: string, fields: string[]): Promise<TReportResponse> {
    this.token = store.getState().user.token;

    const body = {
      fileType,
      fields,
      language: "en"
    };

    const resp: TExportAllAreasResponse = await this.fetchJSON(`/reports/exportAll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (resp.data) {
      return this.checkReportStatus(resp.data);
    }

    throw Error("Failed to get export");
  }

  async exportSomeReports(fileType: string, fields: string[], reports: TReportsDataTable[]): Promise<TReportResponse> {
    this.token = store.getState().user.token;

    const body = {
      fileType,
      fields,
      language: "en",
      ids: reports.map(report => ({ templateid: report.template, reportid: report.id }))
    };

    const resp: TExportSomeReportsResponse = await this.fetchJSON(`/reports/exportSome`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (resp.data) {
      return this.checkReportStatus(resp.data);
    }

    throw Error("Failed to get export");
  }

  async checkReportStatus(id: string): Promise<TReportResponse> {
    let hasFinished = false;

    do {
      const resp: TReportResponse = await this.fetchJSON(`/reports/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (resp.data) {
        hasFinished = true;
        return resp;
      }
      await delay(3000);
    } while (!hasFinished);

    throw Error("Failed to get export");
  }

  exportArea(id: string, fileType: string): Promise<TExportOneAreaResponse> {
    this.token = store.getState().user.token;

    const body = {
      fileType,
      fields: []
    };

    return this.fetchJSON(`/areas/exportOne/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  }
}

export const exportService = new ExportSerive(`${API_BASE_URL_V3}/exports`);
