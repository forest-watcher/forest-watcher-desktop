/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
/**
 * @example {"name":"string","location":"string","priority":0,"monitors":["string"],"notes":"string","status":"string","alert":"string","areaId":"string","templateId":"string","teamIds":["string"],"createdAt":0,"createdBy":"string","areaName":"string"}
 */
export type AssignmentModel = {
  name: string;
  location?: {
    lat?: number;
    lon?: number;
    arrayType?: string;
  }[];
  priority: number;
  monitors: string[];
  notes: string;
  status: "open" | "on hold" | "completed";
  areaId: string;
  templateIds: string[];
  createdAt?: number;
  createdBy?: string;
  areaName?: string;
  geostore?: GeostoreModel;
  templates?: TemplateModel[];
  monitorNames?: {
    id?: string;
    name?: string;
  }[];
  image?: string;
};

export type RouteModel = {
  areaId?: string;
  destination?: PointModel;
  difficulty?: string;
  startDate?: number;
  endDate?: number;
  geostoreId?: string;
  routeId?: string;
  locations?: RouteLocationModel[];
  name?: string;
  createdBy?: string;
  teamId?: string;
  active?: boolean;
};

export type PointModel = {
  latitude?: number;
  longitude?: number;
};

export type RouteLocationModel = {
  accuracy: number;
  altitude: number;
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type TemplateModel = {
  name?: string;
  user?: string;
  languages?: string[];
  defaultLanguage?: string;
  public?: boolean;
  status?: string;
  createdAt?: string;
  questions?: QuestionModel[];
  answersCount?: number;
  isLatest?: boolean;
  editGroupId?: string;
  areas?: {
    id?: string;
    name?: string;
  }[];
};

export type ChildQuestionModel = {
  type: string;
  label: {
    en?: string;
  };
  name: string;
  defaultValue?: string;
  values: string;
  required: boolean;
  order?: number;
  conditionalValue?: number;
};

export type QuestionModel = {
  type: string;
  label: {
    en?: string;
  };
  name: string;
  defaultValue?: string;
  values: string;
  required: boolean;
  order?: number;
  childQuestions?: ChildQuestionModel;
};

/**
 * @example {"report":"string","reportName":"string","templateName":"string","fullName":"string","username":"string","organization":"string","teamId":"string","areaOfInterest":"string","areaOfInterestName":"string","language":"string","userPosition":[],"clickedPosition":[],"user":"string","responses":"string","createdAt":"string"}
 */
export type AnswerModel = {
  report: string;
  reportName: string;
  templateName?: string;
  fullName?: string;
  username?: string;
  organization?: string;
  teamId?: string;
  areaOfInterest?: string;
  areaOfInterestName?: string;
  language: string;
  userPosition?: any[];
  clickedPosition?: any[];
  user: string;
  responses: string;
  createdAt: string;
};

export type TeamModel = {
  name: string;
  userRole?: "administrator" | "manager" | "monitor" | "left";
  createdAt: string;
  members?: TeamMemberModel[];
  areas?: string[];
  layers?: string[];
};

export type AreaModel = {
  name?: string;
  application?: string;
  geostore?: GeostoreModel;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  env?: string;
  datasets?: {
    slug?: string;
    name?: string;
    active?: boolean;
    startDate?: string;
    endDate?: string;
  }[];
  use?: string;
  iso?: string;
  coverage?: string;
  teamId?: string;
  teams?: string[];
  reportTemplate?: TemplateModel[];
};

/**
 * Geojson Feature
 *
 * @example {"geometry":{"coordinates":[0],"type":"string"},"type":"string"}
 */
export type FeatureModel = {
  geometry?: {
    coordinates?: number[];
    type?: string;
  };
  type?: string;
};

export type GeojsonModel = {
  crs?: string;
  type?: string;
  features?: FeatureModel[];
};

export type GeostoreModel = {
  id?: string;
  geojson?: string;
  hash?: string;
  provider?: string;
  areaHa?: number;
  bbox?: number[];
  lock?: boolean;
  info?: string;
};

export type AreaTeamRelationModel = {
  teamId: string;
  areaId: string;
};

export type AreaTemplateRelationModel = {
  templateId: string;
  areaId: string;
};

export type TeamMemberModel = {
  teamId: string;
  userId?: string;
  email: string;
  role: "administrator" | "manager" | "monitor" | "left";
  status: "confirmed" | "invited" | "declined";
  name?: string;
};
