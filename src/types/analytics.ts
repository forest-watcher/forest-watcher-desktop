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
  Assignments = "assignments",
  ExportedReport = "exported_report",
  ManagedArea = "managed_area",
  ReportDetail = "report_detail"
}
export enum MonitoringLabel {
  StartedInvestigation = "started_investigation",
  SelectedAssignment = "selected_assignment",
  ViewReport = "view_report",
  StartedFromMonitoring = "started_from_monitoring",
  ExportedSingleReport = "exported_single_report",
  ReportDownloadedImages = "report_downloaded_images",
  SelectedConnectedAlerts = "selected_connected_areas"
}

interface ReportsEvent {
  category: "Reports";
  action: ReportsActions;
  label?: ReportsLabel;
}

export enum ReportsActions {
  DetailView = "detail_view"
}

export enum ReportsLabel {
  ExportSingleReport = "exported_single_report",
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
  MakeManager = "make_manager",
  DeletedTeam = "deleted_team"
}
interface MapEvent {
  category: "Map";
  action: MapActions;
  label: MapLabel | string;
}
export enum MapActions {
  Basemaps = "basemaps",
  Layers = "layers",
  Legend = "legend",
  PlanetImagery = "planet_imagery"
}
export enum MapLabel {
  Dark = "dark",
  Satellite = "satellite",
  Light = "light",
  PlanetImagery = "planet_imagery",
  ViewedLegend = "viewed_legend",
  Enabled = "enabled"
}

type GenerateEvent<C extends String, E extends string, L extends string | undefined = undefined> = {
  category: C;
  action: E;
  label?: L;
};

export type GAEvents =
  | AreaEvent
  | MonitoringEvent
  | TeamsEvent
  | MapEvent
  | ReportsEvent
  | GenerateEvent<
      "Assignment",
      "create_assigment" | "detail_view",
      | "started_assignment"
      | "selected_point"
      | "uploaded_shapefile"
      | "selected_alert"
      | "completed_assignment"
      | "deleted"
      | "exported_single_assignment"
    >
  | GenerateEvent<
      "Templates",
      "create_template" | "detail_view",
      "started_template" | "completed_template" | "deleted_template"
    >
  | GenerateEvent<"Help", "contact_form" | "help_centre", "submitted_form" | "visited_GFW_Help">;
