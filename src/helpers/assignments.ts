import { AssignmentResponse } from "generated/core/coreResponses";
import { IntlShape } from "react-intl";
const DEFORESTATION_ALERTS = ["umd_as_it_happens", "wur_radd_alerts", "glad_sentinel_2"];

export const priorityToString = (priority?: number): string => {
  return priority && priority > 0 ? "assignments.priority.high" : "assignments.priority.normal";
};

export const getAlertText = (assignment: AssignmentResponse["data"], intl: IntlShape) => {
  if (!assignment) {
    return "-";
  }

  if (assignment.attributes?.geostore) {
    // It is a shapefile / location
    return intl.formatMessage({ id: `layers.location` });
  }

  if (assignment.attributes?.location && assignment.attributes?.location.length) {
    // it is either a set of alerts or a lat / lng location.
    const deforestationLocations =
      assignment.attributes?.location?.filter?.(location => DEFORESTATION_ALERTS.includes(location.alertType || "")) ||
      [];

    const otherLocations =
      assignment.attributes?.location?.filter?.(location => {
        const exists = !!deforestationLocations.find(defLoc => defLoc.alertId === location.alertId);
        return !exists;
      }) || [];

    const deforestationLocationStr = deforestationLocations
      .map(location => intl.formatMessage({ id: `layers.original.${location.alertType}` }))
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .join(", ");

    const otherLocationsStr = otherLocations
      .map(alert =>
        alert.alertType
          ? intl.formatMessage({ id: `layers.${alert.alertType}` })
          : intl.formatMessage({ id: `layers.latlng` })
      )
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .join(", ");

    return deforestationLocationStr.length
      ? [
          intl.formatMessage({ id: `layers.deforestation_combined` }, { alerts: deforestationLocationStr }),
          otherLocationsStr
        ]
          .filter(str => str.length > 0)
          .join(", ")
      : otherLocationsStr;
  }

  return "-";
};
