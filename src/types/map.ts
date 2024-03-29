import { alertTypes, EAlertTypes } from "constants/alerts";
import { Alerts } from "generated/alerts/alertsSchemas";
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

export enum AssignmentLayerType {
  default = "default",
  creator = "creator"
}

export enum AssignmentLayerColours {
  CREATOR = "#4489CE",
  DEFAULT = "#EEBD37"
}

export interface IPoint {
  position: [number, number];
  id: string;
  type?: keyof typeof EAlertTypes | AssignmentLayerType;
}

export type TAlertsById = {
  id: string;
  data: Alerts;
};

export interface IMarkers {
  [key: string]: Marker;
}
