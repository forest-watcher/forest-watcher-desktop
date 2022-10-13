export interface IAlertIdentifier {
  id: string;
  reportNameId: string;
  api: {
    datastoreId: string;
    query: {
      confidenceKey?: string;
      dateKey: string;
      requiresMaxDate: boolean;
      tableName: string;
    };
  };
  requestThreshold: number;
}

interface IAlertTypes {
  [key: string]: IAlertIdentifier;
}

const alertTypes: IAlertTypes = {
  umd_as_it_happens: {
    id: "umd_as_it_happens",
    reportNameId: "GLAD", // Must match regex for report names: [A-Z]
    api: {
      datastoreId: "umd_glad_landsat_alerts",
      query: {
        confidenceKey: "umd_glad_landsat_alerts__confidence",
        dateKey: "umd_glad_landsat_alerts__date",
        requiresMaxDate: true,
        tableName: "umd_glad_landsat_alerts"
      }
    },
    requestThreshold: 365
  },
  glad_sentinel_2: {
    id: "glad_sentinel_2",
    reportNameId: "GLADSTWO", // Must match regex for report names: [A-Z]
    api: {
      datastoreId: "umd_glad_sentinel2_alerts",
      query: {
        confidenceKey: "umd_glad_sentinel2_alerts__confidence",
        dateKey: "umd_glad_sentinel2_alerts__date",
        requiresMaxDate: true,
        tableName: "umd_glad_sentinel2_alerts"
      }
    },
    requestThreshold: 365
  },
  wur_radd_alerts: {
    id: "wur_radd_alerts",
    reportNameId: "RADD", // Must match regex for report names: [A-Z]
    api: {
      datastoreId: "wur_radd_alerts",
      query: {
        confidenceKey: "wur_radd_alerts__confidence",
        dateKey: "wur_radd_alerts__date",
        requiresMaxDate: true,
        tableName: "wur_radd_alerts"
      }
    },
    requestThreshold: 365
  },
  viirs: {
    id: "viirs",
    reportNameId: "VIIRS", // Must match regex for report names: [A-Z]
    api: {
      datastoreId: "nasa_viirs_fire_alerts",
      query: {
        dateKey: "alert__date",
        requiresMaxDate: false,
        tableName: "mytable"
      }
    },
    requestThreshold: 7
  }
};

export { alertTypes };
