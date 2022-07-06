import { components, paths } from "interfaces/forms";
import { API_BASE_URL_V1, API_BASE_URL_V3 } from "constants/global";
import { BaseService } from "./baseService";

export type TReport = components["schemas"]["Report"];
export type TReportResponse = {
  id: string;
  type: string;
  attributes: components["schemas"]["Report"];
};
export type TGetTemplates = paths["/v1/reports"]["get"]["responses"]["200"]["content"]["application/json"];
export type TGetAllAnswers =
  paths["/v1/reports/getAllAnswersForUser"]["get"]["responses"]["200"]["content"]["application/json"];

export class LegacyReportService extends BaseService {
  getAnswers(reportId: string) {
    return this.fetchJSON(`/${reportId}/answers`);
  }

  downloadAnswers(reportId: string) {
    return this.fetchBlob(`/${reportId}/download-answers`);
  }

  saveTemplate(template: TReport, method: string, templateId: string) {
    const url = method === "PATCH" ? `/${templateId}` : `/`;

    return this.fetchJSON(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: method,
      body: JSON.stringify(template)
    });
  }

  deleteTemplate(templateId: string, aois: string[]) {
    const aoisQuery = aois !== null ? `?aoi=${aois.toString()}` : "";

    return this.fetch(`/${templateId}${aoisQuery}`, {
      method: "DELETE"
    });
  }

  getTemplates(): Promise<TGetTemplates> {
    return this.fetchJSON("/");
  }

  getTemplate(templateId: string) {
    return this.fetchJSON(`/${templateId}`);
  }
}

export class ReportService extends BaseService {
  getAnswers(): Promise<TGetAllAnswers> {
    return this.fetchJSON("/getAllAnswersForUser");
  }
}

export const legacy_reportService = new LegacyReportService(`${API_BASE_URL_V1}/reports`);
export const reportService = new ReportService(`${API_BASE_URL_V3}/reports`);
