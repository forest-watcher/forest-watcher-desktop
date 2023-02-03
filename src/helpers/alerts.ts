import { Alerts } from "generated/alerts/alertsSchemas";
import moment from "moment";

/**
 * Takes an array of alerts and returns a shallow copy of the array sorted in ascending order
 * Sorted by the `.date` property of the Alerts Schema
 * @see generated/alerts/alertsSchemas
 * @param alerts an array of alert data
 * @return alerts sorted array of the alert data
 */
export const sortAlertsInAscendingOrder = (alerts: Alerts[] = []) =>
  [...alerts].sort((a, b) => Number(moment(a.date).format("X")) - Number(moment(b.date).format("X")));
