import { Alerts } from "generated/alerts/alertsSchemas";
import moment from "moment";

/**
 * Takes an array of alerts and returns a shallow copy of the array sorted oldest date first (ascending)
 * Sorted by the `.date` property of the Alerts Schema
 * @see generated/alerts/alertsSchemas
 * @param alerts an array of alert data
 * @return alerts sorted array of the alert data
 */
export const sortAlertsOldestFirst = (alerts: Alerts[] = []) =>
  [...alerts].sort((a, b) => Number(moment(a.date).unix()) - Number(moment(b.date).unix()));

/**
 * Takes an array of alerts and returns a shallow copy of the array sorted newest date first (descending)
 * Sorted by the `.date` property of the Alerts Schema
 * @see generated/alerts/alertsSchemas
 * @param alerts an array of alert data
 * @return alerts sorted array of the alert data
 */
export const sortAlertsNewestFirst = (alerts: Alerts[] = []) =>
  [...alerts].sort((a, b) => Number(moment(b.date).unix()) - Number(moment(a.date).unix()));
