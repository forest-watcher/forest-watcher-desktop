import { BaseService } from "./baseService";
import { API_BASE_URL_V3 } from "../constants/global";
import { paths } from "../interfaces/api";

export type TGetAreasByTeamId =
  paths["/v3/forest-watcher/area/teamAreas/{teamId}"]["get"]["responses"]["200"]["content"]["application/json"];

export class APIService extends BaseService {
  getAreasByTeamId(teamId: string): Promise<TGetAreasByTeamId> {
    return this.fetchJSON(`/teamAreas/${teamId}`); // ToDo: switch to fw_core
  }
}

export const apiService = new APIService(`${API_BASE_URL_V3}/forest-watcher/area`);
