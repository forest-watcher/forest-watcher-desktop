// These are used in API requests,
// so the values must be defined (can't be 1, 2, 3, etc)
export enum EAlertTypes {
  "umd_as_it_happens" = "umd_as_it_happens",
  "glad_sentinel_2" = "glad_sentinel_2",
  "wur_radd_alerts" = "wur_radd_alerts",
  "viirs" = "viirs"
}

export const allDeforestationAlerts = [
  EAlertTypes.umd_as_it_happens,
  EAlertTypes.glad_sentinel_2,
  EAlertTypes.wur_radd_alerts
];

export interface IAlertIdentifier {
  id: EAlertTypes;
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
    id: EAlertTypes.umd_as_it_happens,
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
    id: EAlertTypes.glad_sentinel_2,
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
    id: EAlertTypes.wur_radd_alerts,
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
    id: EAlertTypes.viirs,
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

export type TRequestThreshold = {
  labelKey: string;
  requestThreshold: number;
};

export const DefaultRequestThresholds: readonly TRequestThreshold[] = [
  {
    labelKey: "timeframes.2weeks",
    requestThreshold: 14 // 7 days * 2
  },
  {
    labelKey: "timeframes.1month",
    requestThreshold: 31 // 31 days
  },
  {
    labelKey: "timeframes.2months",
    requestThreshold: 62 // 31 days * 2
  },
  {
    labelKey: "timeframes.6months",
    requestThreshold: 186 // 31 days * 6
  }
];

export const ViirsRequestThresholds: readonly TRequestThreshold[] = [
  {
    labelKey: "timeframes.1day",
    requestThreshold: 1
  },
  {
    labelKey: "timeframes.2days",
    requestThreshold: 2
  },
  {
    labelKey: "timeframes.6days",
    requestThreshold: 6
  },
  {
    labelKey: "timeframes.12days",
    requestThreshold: 12
  }
];

export { alertTypes };
