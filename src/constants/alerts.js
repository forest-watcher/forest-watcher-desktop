const alertTypes = {
  umd_as_it_happens: {
    id: "umd_as_it_happens",
    reportNameId: "GLAD" // Must match regex for report names: [A-Z]
  },
  glad_sentinel_2: {
    id: "glad_sentinel_2",
    reportNameId: "GLADSTWO" // Must match regex for report names: [A-Z]
  },
  gfw_radd_alerts: {
    id: "gfw_radd_alerts",
    reportNameId: "RADD" // Must match regex for report names: [A-Z]
  },
  viirs: {
    id: "viirs",
    reportNameId: "VIIRS" // Must match regex for report names: [A-Z]
  }
};

export {alertTypes};