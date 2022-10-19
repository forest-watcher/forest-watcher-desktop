import { alertTypes, IAlertIdentifier } from "constants/alerts";
import { Marker } from "mapbox-gl";

export const ReportLayers = {
  VIIRS: alertTypes.viirs.id
};

export enum ReportLayerColours {
  VIIRS = "#5E4FC3",
  DEFAULT = "#94BE43"
}

export enum AlertLayerColours {
  VIIRS = "#F74848",
  DEFAULT = "#FF6799"
}

export interface IPoint {
  position: [number, number];
  id: string;
  alertTypes?: IAlertIdentifier[];
}

export interface IMarkers {
  [key: string]: Marker;
}
