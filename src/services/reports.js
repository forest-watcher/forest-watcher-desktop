import { API_BASE_URL } from "../constants/global";
import { BaseService } from "./baseService";

export class ReportService extends BaseService {
  setToken(token) {
    this.token = token;
  }

  getAnswers(reportId) {
    return this.fetchJSON(`/${reportId}/answers`);
  }

  downloadAnswers(reportId) {
    return this.fetchBlob(`/${reportId}/download-answers`);
  }

  saveTemplate(template, method, templateId) {
    const url = method === "PATCH" ? `/${templateId}` : `/`;

    return this.fetchJSON(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: method,
      body: JSON.stringify(template)
    });
  }

  deleteTemplate(templateId, aois) {
    const aoisQuery = aois !== null ? `?aoi=${aois.toString()}` : "";

    return this.fetch(`/${templateId}${aoisQuery}`, {
      method: "DELETE"
    });
  }

  getTemplates() {
    return this.fetchJSON("/");
  }

  getTemplate(templateId) {
    return this.fetchJSON(`/${templateId}`);
  }
}

export const reportService = new ReportService(`${API_BASE_URL}/reports`);
