import { alertTypes } from "constants/alerts";

// Using a full regex match for the end of the report name here including data so if user names there area something like SAMS-WIGGLY-REPORT
// it doesn't intefere with our logic.
const reportNameRegex = /-([A-Z|]+)-REPORT--\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d/;

/**
 *
 * @param {string} reportName Name of the report
 * @returns {array} Alert types of the report
 */
const getReportAlertsByName = (reportName = "") => {
  if (!reportName) {
    return [];
  }

  const result = reportName.match(reportNameRegex);

  if (!result || result.length < 2) {
    return [];
  }

  // Split the match for alert types by the seperator (|)
  const nameIds = result[1].split("|");

  // Match the alert types reported with alertTypes
  return Object.values(alertTypes).filter(alert => nameIds.includes(alert.reportNameId));
};

export { getReportAlertsByName };
