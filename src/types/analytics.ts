interface AreaEvent {
  category: "Areas";
  action: AreaActions;
  label?: AreaLabel;
}

export enum AreaActions {
  Export = "Export areas",
  Investigation = "investigation",
  Managed = "managed_area"
}

export enum AreaLabel {
  StartedInvestigation = "started_investigation",
  StartedFromAreas = "started_from_areas",
  AddedTemplate = "added_template",
  AddedTeam = "added_team",
  CreateTeam = "create_team",
  StartedFromMonitoring = "started_from_monitoring"
}

interface MonitoringEvent {
  category: "Monitoring";
  action: MonitoringActions;
  label?: MonitoringLabel;
}

export enum MonitoringActions {
  Investigation = "investigation",
  ExportedReport = "exported_report",
  ManagedArea = "managed_area",
  ReportDetail = "report_detail"
}
export enum MonitoringLabel {
  StartedInvestigation = "started_investigation",
  ViewReport = "view_report",
  StartedFromMonitoring = "started_from_monitoring",
  ExportedSingleReport = "exported_single_report",
  ReportDownloadedImages = "report_downloaded_images"
}

interface TeamsEvent {
  category: "Teams";
  action: TeamActions;
  label: TeamLabels;
}

export enum TeamActions {
  teamCreation = "team_creation",
  teamManagement = "team_management"
}
export enum TeamLabels {
  TeamCreationStart = "team_creation_start",
  TeamCreationComplete = "team_creation_complete",
  AddedMonitor = "added_monitor",
  AddedManager = "added_manager",
  DeletedTeam = "deleted_team"
}
interface MapEvent {
  category: "Map";
  action: MapActions;
  label: MapLabel | string;
}
export enum MapActions {
  Basemaps = "basemaps",
  Layers = "layers"
}
export enum MapLabel {
  Dark = "dark",
  Satellite = "satellite",
  Light = "light",
  PlanetImagery = "planet_imagery"
}

export type GAEvents = AreaEvent | MonitoringEvent | TeamsEvent | MapEvent;
