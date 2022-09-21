export interface IAlertIdentifier {
  id: string;
  reportNameId: string;
}

interface IAlertTypes {
  [key: string]: IAlertIdentifier;
}

const alertTypes: IAlertTypes = {
  umd_as_it_happens: {
    id: "umd_as_it_happens",
    reportNameId: "GLAD" // Must match regex for report names: [A-Z]
  },
  glad_sentinel_2: {
    id: "glad_sentinel_2",
    reportNameId: "GLADSTWO" // Must match regex for report names: [A-Z]
  },
  wur_radd_alerts: {
    id: "wur_radd_alerts",
    reportNameId: "RADD" // Must match regex for report names: [A-Z]
  },
  viirs: {
    id: "viirs",
    reportNameId: "VIIRS" // Must match regex for report names: [A-Z]
  }
};

export { alertTypes };
