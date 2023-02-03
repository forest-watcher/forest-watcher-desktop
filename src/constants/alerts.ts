// These are used in API requests,
// so the values must be defined (can't be 1, 2, 3, etc)
export enum EAlertTypes {
  GLAD = "GLAD",
  GLADS2 = "GLADS2",
  RADD = "RADD",
  VIIRS = "VIIRS"
}

export const allDeforestationAlerts = [EAlertTypes.GLAD, EAlertTypes.GLADS2, EAlertTypes.RADD];

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
    id: EAlertTypes.GLAD,
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
    id: EAlertTypes.GLADS2,
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
    id: EAlertTypes.RADD,
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
    id: EAlertTypes.VIIRS,
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
    requestThreshold: 60 // 31 days * 2
  },
  {
    labelKey: "timeframes.6months",
    requestThreshold: 180 // 31 days * 6
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
