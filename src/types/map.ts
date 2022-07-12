import { Marker } from "mapbox-gl";

export enum ReportLayers {
  VIIRS = "viirs"
}

export enum ReportLayerColours {
  VIIRS = "#5E4FC3",
  DEFAULT = "#94BE43"
}

export interface IPoint {
  position: [number, number];
  id: string;
  layer?: string;
}

export interface IMarkers {
  [key: string]: Marker;
}
