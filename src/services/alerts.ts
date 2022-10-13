import { ALERTS_API_URL, ALERTS_API_TOKEN } from "constants/global";
import { alertTypes as DATASETS } from "constants/alerts";
import { BaseService } from "services/baseService";
import { formatDate } from "helpers/dates";
import { IAlertIdentifier } from "constants/alerts";

export class AlertsService extends BaseService {
  async getAlertsByGeoStoreId(geostoreId: string, DATASET: IAlertIdentifier): Promise<any> {
    const { confidenceKey, dateKey, tableName, requiresMaxDate } = DATASET.api.query;

    const now = new Date();
    const minDate = new Date(now);
    minDate.setDate(minDate.getDate() - DATASET.requestThreshold);

    let URL = `/${
      DATASET.api.datastoreId
    }/latest/query/json?geostore_origin=rw&geostore_id=${geostoreId}&sql=select latitude, longitude, ${dateKey}${
      confidenceKey ? ", " + confidenceKey : ""
    } from ${tableName} where ${dateKey} > '${formatDate(minDate, "YYYY-MM-DD")}'`;

    if (requiresMaxDate) {
      URL += ` and ${dateKey} < '${formatDate(now, "YYYY-MM-DD")}'`;
    }

    URL += ` ORDER BY ${dateKey} DESC LIMIT 10000`;

    return this.fetchJSON(URL, {
      headers: {
        Origin: "com.wri.forestwatcher",
        "x-api-key": ALERTS_API_TOKEN!
      }
    });
  }

  async getAlertsForArea(area: any) {
    const geostoreId = area.attributes.geostore.id;

    const alerts = {};
    for (const datasetConfig of Object.values(DATASETS)) {
      Object.assign(alerts, {
        [datasetConfig.id]: (await this.getAlertsByGeoStoreId(geostoreId, datasetConfig))["data"]
      });
    }

    return alerts;
  }
}

export const alertsService = new AlertsService(`${ALERTS_API_URL}/dataset`);
