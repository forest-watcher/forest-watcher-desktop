/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/v1/forest-watcher/area": {
    /** Retrieve areas for the logged in user */
    get: operations["get-all-user-areas"];
    /** Create a new area for the logged in user */
    post: operations["post-user-area"];
    parameters: {};
  };
  "/v1/fw_api/healthcheck": {
    get: operations["get-fw_api-healthcheck"];
    parameters: {};
  };
  "/v3/fw_api/healthcheck": {
    get: operations["get-v3-fw_api-healthcheck"];
    parameters: {};
  };
  "/v3/forest-watcher/area": {
    /** Retrieve areas for the logged in user */
    get: operations["get-v3-forest-watcher-areas"];
  };
  "/v3/forest-watcher/area/{areaId}": {
    /** Retrieve an area for the logged in user */
    get: operations["get-v3-forest-watcher-area"];
    /** Delete an area which the logged in user has either created, or is associated with a team they are manager of */
    delete: operations["delete-v3-forest-watcher-area-areaId"];
    parameters: {
      path: {
        areaId: string;
      };
    };
  };
  "/v3/forest-watcher/area/areaTeams/{areaId}": {
    /** Retrieve areas for the logged in user */
    get: operations["get-v3-forest-watcher-areas-by-logged-user"];
    parameters: {
      path: {
        areaId: string;
      };
    };
  };
  "/v3/forest-watcher/area/{areaId}/template/{templateId}": {
    /** Link a template to an area */
    post: operations["post-v3-forest-watcher-area-areaId-template-templateId"];
    /** Remove a template from an area */
    delete: operations["delete-v3-forest-watcher-area-areaId-template-templateId"];
    parameters: {
      path: {
        areaId: string;
        templateId: string;
      };
    };
  };
}

export interface components {
  schemas: {};
  responses: {
    /** Error Response */
    Error: {
      content: {
        "application/json": {
          errors: {
            status: number;
            detail: string;
          }[];
        };
      };
    };
    /** Healthcheck response */
    Healthcheck: {
      content: {
        "application/json": {
          uptime?: number;
        };
      };
    };
  };
}

export interface operations {
  /** Retrieve areas for the logged in user */
  "get-all-user-areas": {
    parameters: {};
    responses: {
      /** OK */
      200: unknown;
      401: components["responses"]["Error"];
      404: components["responses"]["Error"];
    };
  };
  /** Create a new area for the logged in user */
  "post-user-area": {
    parameters: {};
    responses: {
      /** OK */
      200: unknown;
      401: components["responses"]["Error"];
    };
  };
  "get-fw_api-healthcheck": {
    parameters: {};
    responses: {
      200: components["responses"]["Healthcheck"];
    };
  };
  "get-v3-fw_api-healthcheck": {
    parameters: {};
    responses: {
      200: components["responses"]["Healthcheck"];
    };
  };
  /** Retrieve areas for the logged in user */
  "get-v3-forest-watcher-areas": {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": {
            type: string;
            id: string;
            attributes: {
              name: string;
              application: string;
              geostore: {
                geojson: {
                  crs: { [key: string]: unknown };
                  type: string;
                  features: {
                    geometry?: {
                      coordinates: {
                        "0"?: {
                          "0"?: { [key: string]: unknown }[];
                          "1"?: { [key: string]: unknown }[];
                          "2"?: { [key: string]: unknown }[];
                          "3"?: { [key: string]: unknown }[];
                          "4"?: { [key: string]: unknown }[];
                          "5"?: { [key: string]: unknown }[];
                          "6"?: { [key: string]: unknown }[];
                        }[];
                      }[];
                      type: string;
                    };
                    type: string;
                  }[];
                };
                hash: string;
                provider: { [key: string]: unknown };
                areaHa: number;
                bbox: { [key: string]: unknown }[];
                lock: boolean;
                info: {
                  use: { [key: string]: unknown };
                };
                id: string;
              };
              userId: string;
              createdAt: string;
              updatedAt: string;
              image: string;
              env: string;
              datasets: {
                slug: string;
                name: string;
                active: boolean;
                startDate: string;
                endDate: string;
              }[];
              use: { [key: string]: unknown };
              iso: { [key: string]: unknown };
              templateId: string;
              coverage: { [key: string]: unknown }[];
              reportTemplate: {
                name?: {
                  en: string;
                  es: string;
                  fr: string;
                  id: string;
                  pt: string;
                };
                languages?: { [key: string]: unknown }[];
                defaultLanguage: string;
                user: string;
                answersCount: number;
                questions?: {
                  type: string;
                  name: string;
                  Id: string;
                  conditions?: { [key: string]: unknown }[];
                  childQuestions?: { [key: string]: unknown }[];
                  order: number;
                  required: boolean;
                  values?: {
                    pt: {
                      value: number;
                      label: string;
                    }[];
                    id: {
                      value: number;
                      label: string;
                    }[];
                    fr: {
                      value: number;
                      label: string;
                    }[];
                    es: {
                      value: number;
                      label: string;
                    }[];
                    en: {
                      value: number;
                      label: string;
                    }[];
                  };
                  label?: {
                    pt: string;
                    fr: string;
                    id: string;
                    es: string;
                    en: string;
                  };
                }[];
                createdAt: string;
                public: boolean;
                status: string;
                id: string;
              }[];
            };
          };
        };
      };
      401: components["responses"]["Error"];
      404: components["responses"]["Error"];
    };
  };
  /** Retrieve an area for the logged in user */
  "get-v3-forest-watcher-area": {
    parameters: {
      path: {
        areaId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": {
            type: string;
            id: string;
            attributes: {
              name: string;
              application: string;
              geostore: {
                geojson: {
                  crs: { [key: string]: unknown };
                  type: string;
                  features: {
                    geometry?: {
                      coordinates: {
                        "0"?: {
                          "0"?: { [key: string]: unknown }[];
                          "1"?: { [key: string]: unknown }[];
                          "2"?: { [key: string]: unknown }[];
                          "3"?: { [key: string]: unknown }[];
                          "4"?: { [key: string]: unknown }[];
                          "5"?: { [key: string]: unknown }[];
                          "6"?: { [key: string]: unknown }[];
                        }[];
                      }[];
                      type: string;
                    };
                    type: string;
                  }[];
                };
                hash: string;
                provider: { [key: string]: unknown };
                areaHa: number;
                bbox: { [key: string]: unknown }[];
                lock: boolean;
                info: {
                  use: { [key: string]: unknown };
                };
                id: string;
              };
              userId: string;
              createdAt: string;
              updatedAt: string;
              image: string;
              env: string;
              datasets: {
                slug: string;
                name: string;
                active: boolean;
                startDate: string;
                endDate: string;
              }[];
              use: { [key: string]: unknown };
              iso: { [key: string]: unknown };
              templateId: string;
              coverage: { [key: string]: unknown }[];
              reportTemplate: {
                name?: {
                  en: string;
                  es: string;
                  fr: string;
                  id: string;
                  pt: string;
                };
                languages?: { [key: string]: unknown }[];
                defaultLanguage: string;
                user: string;
                answersCount: number;
                questions?: {
                  type: string;
                  name: string;
                  Id: string;
                  conditions?: { [key: string]: unknown }[];
                  childQuestions?: { [key: string]: unknown }[];
                  order: number;
                  required: boolean;
                  values?: {
                    pt: {
                      value: number;
                      label: string;
                    }[];
                    id: {
                      value: number;
                      label: string;
                    }[];
                    fr: {
                      value: number;
                      label: string;
                    }[];
                    es: {
                      value: number;
                      label: string;
                    }[];
                    en: {
                      value: number;
                      label: string;
                    }[];
                  };
                  label?: {
                    pt: string;
                    fr: string;
                    id: string;
                    es: string;
                    en: string;
                  };
                }[];
                createdAt: string;
                public: boolean;
                status: string;
                id: string;
              }[];
            };
          };
        };
      };
      401: components["responses"]["Error"];
      404: components["responses"]["Error"];
    };
  };
  /** Delete an area which the logged in user has either created, or is associated with a team they are manager of */
  "delete-v3-forest-watcher-area-areaId": {
    parameters: {
      path: {
        areaId: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
      /** You are not authorised to delete this record */
      401: unknown;
    };
  };
  /** Retrieve areas for the logged in user */
  "get-v3-forest-watcher-areas-by-logged-user": {
    parameters: {
      path: {
        areaId: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": {
            type: string;
            id: string;
            attributes: {
              name: string;
              application: string;
              geostore: {
                geojson: {
                  crs: { [key: string]: unknown };
                  type: string;
                  features: {
                    geometry?: {
                      coordinates: {
                        "0"?: {
                          "0"?: { [key: string]: unknown }[];
                          "1"?: { [key: string]: unknown }[];
                          "2"?: { [key: string]: unknown }[];
                          "3"?: { [key: string]: unknown }[];
                          "4"?: { [key: string]: unknown }[];
                          "5"?: { [key: string]: unknown }[];
                          "6"?: { [key: string]: unknown }[];
                        }[];
                      }[];
                      type: string;
                    };
                    type: string;
                  }[];
                };
                hash: string;
                provider: { [key: string]: unknown };
                areaHa: number;
                bbox: { [key: string]: unknown }[];
                lock: boolean;
                info: {
                  use: { [key: string]: unknown };
                };
                id: string;
              };
              userId: string;
              createdAt: string;
              updatedAt: string;
              image: string;
              env: string;
              datasets: {
                slug: string;
                name: string;
                active: boolean;
                startDate: string;
                endDate: string;
              }[];
              use: { [key: string]: unknown };
              iso: { [key: string]: unknown };
              templateId: string;
              coverage: { [key: string]: unknown }[];
              reportTemplate: {
                name?: {
                  en: string;
                  es: string;
                  fr: string;
                  id: string;
                  pt: string;
                };
                languages?: { [key: string]: unknown }[];
                defaultLanguage: string;
                user: string;
                answersCount: number;
                questions?: {
                  type: string;
                  name: string;
                  Id: string;
                  conditions?: { [key: string]: unknown }[];
                  childQuestions?: { [key: string]: unknown }[];
                  order: number;
                  required: boolean;
                  values?: {
                    pt: {
                      value: number;
                      label: string;
                    }[];
                    id: {
                      value: number;
                      label: string;
                    }[];
                    fr: {
                      value: number;
                      label: string;
                    }[];
                    es: {
                      value: number;
                      label: string;
                    }[];
                    en: {
                      value: number;
                      label: string;
                    }[];
                  };
                  label?: {
                    pt: string;
                    fr: string;
                    id: string;
                    es: string;
                    en: string;
                  };
                }[];
                createdAt: string;
                public: boolean;
                status: string;
                id: string;
              }[];
            };
          };
        };
      };
      401: components["responses"]["Error"];
      404: components["responses"]["Error"];
      /** Array of team ids */
      "": {
        content: {
          "application/json": string[];
        };
      };
    };
  };
  /** Link a template to an area */
  "post-v3-forest-watcher-area-areaId-template-templateId": {
    parameters: {
      path: {
        areaId: string;
        templateId: string;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      401: components["responses"]["Error"];
      404: components["responses"]["Error"];
    };
  };
  /** Remove a template from an area */
  "delete-v3-forest-watcher-area-areaId-template-templateId": {
    parameters: {
      path: {
        areaId: string;
        templateId: string;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      /** Unauthorized */
      401: unknown;
      /** Not Found */
      404: unknown;
    };
  };
}

export interface external {}