/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
import type * as Schemas from "./coreSchemas";

export type AssignmentBody = {
  location?: {
    lat?: number;
    lon?: number;
    alertType?: string;
  };
  priority: number;
  monitors: string[];
  notes: string;
  status: "open" | "on hold" | "completed";
  alert?: string;
  areaId: string;
  templateId: string;
  teamIds: string[];
  geostore?: Schemas.GeojsonModel;
};

export type RouteBody = {
  areaId?: string;
  destination?: Schemas.PointModel;
  difficulty?: string;
  endDate?: number;
  geostoreId?: string;
  id?: string;
  locations?: Schemas.RouteLocationModel[];
  name?: string;
  startDate?: number;
}[];

export type TemplateBody = {
  name: string;
  questions: Schemas.QuestionModel[];
  languages: string[];
  status: string;
  public?: boolean;
  defaultLanguage: string;
};

export type UpdateTemplateBody = {
  name?: string;
  questions?: {
    type?: string;
    label?: {
      en?: string;
    };
    name?: string;
    defaultValue?: string;
    values?: string;
    required?: boolean;
    order?: number;
    childQuestions?: {
      type?: string;
      label?: {
        en?: string;
      };
      name?: string;
      defaultValue?: string;
      values?: string;
      required?: boolean;
      order?: number;
      conditionalValue?: number;
    };
  }[];
  languages?: string[];
  status?: string;
  public?: boolean;
  defaultLanguage?: string;
};

export type AnswerBody = {
  reportName: string;
  areaOfInterest: string;
  areaOfInterestName: string;
  language: string;
  userPosition: string;
  clickedPosition: string;
  user: string;
  date: string;
  responses: Record<string, any>[];
};

export type AreaBody = {
  name?: string;
  geojson?: Schemas.GeojsonModel;
  /**
   * Must be image file
   */
  image?: null;
};

export type AreaTeamRelationBody = {
  areaId: string;
  teamId: string;
};

export type AreaTemplateRelationBody = {
  templateId?: string;
  areaId?: string;
};

export type TeamBody = {
  name: string;
};

export type UpdateAssignmentBody = {
  name?: string;
  priority?: number;
  monitors?: string[];
  notes?: string;
  status?: string;
  templateId?: string;
  teamIds?: string[];
};