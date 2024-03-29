/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
import * as reactQuery from "@tanstack/react-query";
import { useExportsContext, ExportsContext } from "./exportsContext";
import type * as Fetcher from "./exportsFetcher";
import { exportsFetch } from "./exportsFetcher";
import type * as RequestBodies from "./exportsRequestBodies";
import type * as Responses from "./exportsResponses";

export type PostV3ReportsTemplateIdExportSomeError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: Responses.Error;
    }
  | {
      status: 401;
      payload: Responses.Error;
    }
  | {
      status: 404;
      payload: Responses.Error;
    }
>;

export type PostV3ReportsTemplateIdExportSomeResponse = {
  data?: string;
};

export type PostV3ReportsTemplateIdExportSomeRequestBody = {
  ids?: {
    templateid?: string;
    reportid?: string;
  }[];
  language?: string;
  fileType?: string;
  fields?: string[];
  email?: string;
};

export type PostV3ReportsTemplateIdExportSomeVariables = {
  body?: PostV3ReportsTemplateIdExportSomeRequestBody;
} & ExportsContext["fetcherOptions"];

/**
 * Exports a selection of report answers and associated images given its id as either fwbundle or zipped csv. The "fields" array in the body determines the columns in any csv export. Include "responses" if questions and answers are required. The response is an id to poll the GET /v3/exports/reports/{id} endpoint is for the URL once the export has completed
 */
export const fetchPostV3ReportsTemplateIdExportSome = (
  variables: PostV3ReportsTemplateIdExportSomeVariables,
  signal?: AbortSignal
) =>
  exportsFetch<
    PostV3ReportsTemplateIdExportSomeResponse,
    PostV3ReportsTemplateIdExportSomeError,
    PostV3ReportsTemplateIdExportSomeRequestBody,
    {},
    {},
    {}
  >({ url: "/v3/exports/reports/exportSome", method: "post", ...variables, signal });

/**
 * Exports a selection of report answers and associated images given its id as either fwbundle or zipped csv. The "fields" array in the body determines the columns in any csv export. Include "responses" if questions and answers are required. The response is an id to poll the GET /v3/exports/reports/{id} endpoint is for the URL once the export has completed
 */
export const usePostV3ReportsTemplateIdExportSome = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      PostV3ReportsTemplateIdExportSomeResponse,
      PostV3ReportsTemplateIdExportSomeError,
      PostV3ReportsTemplateIdExportSomeVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useExportsContext();
  return reactQuery.useMutation<
    PostV3ReportsTemplateIdExportSomeResponse,
    PostV3ReportsTemplateIdExportSomeError,
    PostV3ReportsTemplateIdExportSomeVariables
  >(
    (variables: PostV3ReportsTemplateIdExportSomeVariables) =>
      fetchPostV3ReportsTemplateIdExportSome({ ...fetcherOptions, ...variables }),
    options
  );
};

export type PostV3ReportsTemplateIdExportAllError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: Responses.Error;
    }
  | {
      status: 401;
      payload: Responses.Error;
    }
  | {
      status: 404;
      payload: Responses.Error;
    }
>;

export type PostV3ReportsTemplateIdExportAllResponse = {
  data?: string;
};

export type PostV3ReportsTemplateIdExportAllRequestBody = {
  language?: string;
  fileType?: string;
  fields?: string[];
  email?: string;
};

export type PostV3ReportsTemplateIdExportAllVariables = {
  body?: PostV3ReportsTemplateIdExportAllRequestBody;
} & ExportsContext["fetcherOptions"];

/**
 * Exports all report answers and associated images available to the user for the given template as either fwbundle or zipped csv.The "fields" array in the body determines the columns in any csv export. Include "responses" if questions and answers are required. The response is an id to poll the GET /v3/exports/reports/{id} endpoint is for the URL once the export has completed
 */
export const fetchPostV3ReportsTemplateIdExportAll = (
  variables: PostV3ReportsTemplateIdExportAllVariables,
  signal?: AbortSignal
) =>
  exportsFetch<
    PostV3ReportsTemplateIdExportAllResponse,
    PostV3ReportsTemplateIdExportAllError,
    PostV3ReportsTemplateIdExportAllRequestBody,
    {},
    {},
    {}
  >({ url: "/v3/exports/reports/exportAll", method: "post", ...variables, signal });

/**
 * Exports all report answers and associated images available to the user for the given template as either fwbundle or zipped csv.The "fields" array in the body determines the columns in any csv export. Include "responses" if questions and answers are required. The response is an id to poll the GET /v3/exports/reports/{id} endpoint is for the URL once the export has completed
 */
export const usePostV3ReportsTemplateIdExportAll = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      PostV3ReportsTemplateIdExportAllResponse,
      PostV3ReportsTemplateIdExportAllError,
      PostV3ReportsTemplateIdExportAllVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useExportsContext();
  return reactQuery.useMutation<
    PostV3ReportsTemplateIdExportAllResponse,
    PostV3ReportsTemplateIdExportAllError,
    PostV3ReportsTemplateIdExportAllVariables
  >(
    (variables: PostV3ReportsTemplateIdExportAllVariables) =>
      fetchPostV3ReportsTemplateIdExportAll({ ...fetcherOptions, ...variables }),
    options
  );
};

export type GetV3ExportsReportsIdPathParams = {
  id: string;
};

export type GetV3ExportsReportsIdError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type GetV3ExportsReportsIdResponse = {
  data?: string;
};

export type GetV3ExportsReportsIdVariables = {
  pathParams: GetV3ExportsReportsIdPathParams;
} & ExportsContext["fetcherOptions"];

/**
 * Returns the url for a given id token received from a reports export request
 */
export const fetchGetV3ExportsReportsId = (variables: GetV3ExportsReportsIdVariables, signal?: AbortSignal) =>
  exportsFetch<
    GetV3ExportsReportsIdResponse,
    GetV3ExportsReportsIdError,
    undefined,
    {},
    {},
    GetV3ExportsReportsIdPathParams
  >({ url: "/v3/exports/reports/{id}", method: "get", ...variables, signal });

/**
 * Returns the url for a given id token received from a reports export request
 */
export const useGetV3ExportsReportsId = <TData = GetV3ExportsReportsIdResponse>(
  variables: GetV3ExportsReportsIdVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<GetV3ExportsReportsIdResponse, GetV3ExportsReportsIdError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useExportsContext(options);
  return reactQuery.useQuery<GetV3ExportsReportsIdResponse, GetV3ExportsReportsIdError, TData>(
    queryKeyFn({ path: "/v3/exports/reports/{id}", operationId: "getV3ExportsReportsId", variables }),
    ({ signal }) => fetchGetV3ExportsReportsId({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions
    }
  );
};

export type PostV3ExportsReportsIdPathParams = {
  id: string;
};

export type PostV3ExportsReportsIdError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type PostV3ExportsReportsIdResponse = {
  data?: string;
};

export type PostV3ExportsReportsIdRequestBody = {
  /**
   * Can be the string 'zip' or 'pdf' which dictates the file type of the exports response
   */
  fileType?: string;
};

export type PostV3ExportsReportsIdVariables = {
  body?: PostV3ExportsReportsIdRequestBody;
  pathParams: PostV3ExportsReportsIdPathParams;
} & ExportsContext["fetcherOptions"];

/**
 * Returns the id token for the exports file of the report (answer) images
 */
export const fetchPostV3ExportsReportsId = (variables: PostV3ExportsReportsIdVariables, signal?: AbortSignal) =>
  exportsFetch<
    PostV3ExportsReportsIdResponse,
    PostV3ExportsReportsIdError,
    PostV3ExportsReportsIdRequestBody,
    {},
    {},
    PostV3ExportsReportsIdPathParams
  >({ url: "/v3/exports/reports/{id}/images", method: "post", ...variables, signal });

/**
 * Returns the id token for the exports file of the report (answer) images
 */
export const usePostV3ExportsReportsId = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      PostV3ExportsReportsIdResponse,
      PostV3ExportsReportsIdError,
      PostV3ExportsReportsIdVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useExportsContext();
  return reactQuery.useMutation<
    PostV3ExportsReportsIdResponse,
    PostV3ExportsReportsIdError,
    PostV3ExportsReportsIdVariables
  >(
    (variables: PostV3ExportsReportsIdVariables) => fetchPostV3ExportsReportsId({ ...fetcherOptions, ...variables }),
    options
  );
};

export type PostV3AreasExportOneAreaIdPathParams = {
  areaId: string;
};

export type PostV3AreasExportOneAreaIdError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: Responses.Error;
    }
  | {
      status: 401;
      payload: Responses.Error;
    }
  | {
      status: 404;
      payload: Responses.Error;
    }
>;

export type PostV3AreasExportOneAreaIdResponse = {
  data?: string;
};

export type PostV3AreasExportOneAreaIdVariables = {
  body?: RequestBodies.ExportAreasRequest;
  pathParams: PostV3AreasExportOneAreaIdPathParams;
} & ExportsContext["fetcherOptions"];

/**
 * Exports an and associated images given its id as either fwbundle or zipped csv, shp or geojson. The "fields" array in the body determines the columns in any csv export. The response is an id to poll the GET /v3/exports/areas/{id} endpoint is for the URL once the export has completed
 */
export const fetchPostV3AreasExportOneAreaId = (variables: PostV3AreasExportOneAreaIdVariables, signal?: AbortSignal) =>
  exportsFetch<
    PostV3AreasExportOneAreaIdResponse,
    PostV3AreasExportOneAreaIdError,
    RequestBodies.ExportAreasRequest,
    {},
    {},
    PostV3AreasExportOneAreaIdPathParams
  >({ url: "/v3/exports/areas/exportOne/{areaId}", method: "post", ...variables, signal });

/**
 * Exports an and associated images given its id as either fwbundle or zipped csv, shp or geojson. The "fields" array in the body determines the columns in any csv export. The response is an id to poll the GET /v3/exports/areas/{id} endpoint is for the URL once the export has completed
 */
export const usePostV3AreasExportOneAreaId = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      PostV3AreasExportOneAreaIdResponse,
      PostV3AreasExportOneAreaIdError,
      PostV3AreasExportOneAreaIdVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useExportsContext();
  return reactQuery.useMutation<
    PostV3AreasExportOneAreaIdResponse,
    PostV3AreasExportOneAreaIdError,
    PostV3AreasExportOneAreaIdVariables
  >(
    (variables: PostV3AreasExportOneAreaIdVariables) =>
      fetchPostV3AreasExportOneAreaId({ ...fetcherOptions, ...variables }),
    options
  );
};

export type PostV3AreasExportAllError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: Responses.Error;
    }
  | {
      status: 401;
      payload: Responses.Error;
    }
  | {
      status: 404;
      payload: Responses.Error;
    }
>;

export type PostV3AreasExportAllResponse = {
  data?: string;
};

export type PostV3AreasExportAllVariables = {
  body?: RequestBodies.ExportAreasRequest;
} & ExportsContext["fetcherOptions"];

/**
 * Exports all areas and associated images available to the user as either fwbundle or zipped csv, shp or geojson. The "fields" array in the body determines the columns in any csv export. The response is an id to poll the GET /v3/exports/areas/{id} endpoint is for the URL once the export has completed
 */
export const fetchPostV3AreasExportAll = (variables: PostV3AreasExportAllVariables, signal?: AbortSignal) =>
  exportsFetch<PostV3AreasExportAllResponse, PostV3AreasExportAllError, RequestBodies.ExportAreasRequest, {}, {}, {}>({
    url: "/v3/exports/areas/exportAll",
    method: "post",
    ...variables,
    signal
  });

/**
 * Exports all areas and associated images available to the user as either fwbundle or zipped csv, shp or geojson. The "fields" array in the body determines the columns in any csv export. The response is an id to poll the GET /v3/exports/areas/{id} endpoint is for the URL once the export has completed
 */
export const usePostV3AreasExportAll = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      PostV3AreasExportAllResponse,
      PostV3AreasExportAllError,
      PostV3AreasExportAllVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useExportsContext();
  return reactQuery.useMutation<PostV3AreasExportAllResponse, PostV3AreasExportAllError, PostV3AreasExportAllVariables>(
    (variables: PostV3AreasExportAllVariables) => fetchPostV3AreasExportAll({ ...fetcherOptions, ...variables }),
    options
  );
};

export type GetV3ExportsAreasIdPathParams = {
  id: string;
};

export type GetV3ExportsAreasIdError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type GetV3ExportsAreasIdVariables = {
  pathParams: GetV3ExportsAreasIdPathParams;
} & ExportsContext["fetcherOptions"];

/**
 * Returns the url for a given id token received from an areas export request
 */
export const fetchGetV3ExportsAreasId = (variables: GetV3ExportsAreasIdVariables, signal?: AbortSignal) =>
  exportsFetch<Responses.Url, GetV3ExportsAreasIdError, undefined, {}, {}, GetV3ExportsAreasIdPathParams>({
    url: "/v3/exports/areas/{id}",
    method: "get",
    ...variables,
    signal
  });

/**
 * Returns the url for a given id token received from an areas export request
 */
export const useGetV3ExportsAreasId = <TData = Responses.Url>(
  variables: GetV3ExportsAreasIdVariables,
  options?: Omit<reactQuery.UseQueryOptions<Responses.Url, GetV3ExportsAreasIdError, TData>, "queryKey" | "queryFn">
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useExportsContext(options);
  return reactQuery.useQuery<Responses.Url, GetV3ExportsAreasIdError, TData>(
    queryKeyFn({ path: "/v3/exports/areas/{id}", operationId: "getV3ExportsAreasId", variables }),
    ({ signal }) => fetchGetV3ExportsAreasId({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions
    }
  );
};

export type PostV3ExportsAssignmentsExportAllError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type PostV3ExportsAssignmentsExportAllVariables = {
  body?: RequestBodies.ExportAllAssignments;
} & ExportsContext["fetcherOptions"];

/**
 * Exports all assignements and associated images the user can see as either fwbundle or zipped csv or geojson or shp. The "fields" array in the body determines the columns in any csv export. The response is an id to poll the GET /v3/exports/assignments/{id} endpoint is for the URL once the export has completed
 */
export const fetchPostV3ExportsAssignmentsExportAll = (
  variables: PostV3ExportsAssignmentsExportAllVariables,
  signal?: AbortSignal
) =>
  exportsFetch<Responses.Id, PostV3ExportsAssignmentsExportAllError, RequestBodies.ExportAllAssignments, {}, {}, {}>({
    url: "/v3/exports/assignments/exportAll",
    method: "post",
    ...variables,
    signal
  });

/**
 * Exports all assignements and associated images the user can see as either fwbundle or zipped csv or geojson or shp. The "fields" array in the body determines the columns in any csv export. The response is an id to poll the GET /v3/exports/assignments/{id} endpoint is for the URL once the export has completed
 */
export const usePostV3ExportsAssignmentsExportAll = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.Id,
      PostV3ExportsAssignmentsExportAllError,
      PostV3ExportsAssignmentsExportAllVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useExportsContext();
  return reactQuery.useMutation<
    Responses.Id,
    PostV3ExportsAssignmentsExportAllError,
    PostV3ExportsAssignmentsExportAllVariables
  >(
    (variables: PostV3ExportsAssignmentsExportAllVariables) =>
      fetchPostV3ExportsAssignmentsExportAll({ ...fetcherOptions, ...variables }),
    options
  );
};

export type PostV3ExportsAssignmentsExportSomeError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type PostV3ExportsAssignmentsExportSomeVariables = {
  body?: RequestBodies.ExportSomeAssignmentsRequest;
} & ExportsContext["fetcherOptions"];

/**
 * Exports a selection of assignements and associated images given its id as either fwbundle or zipped csv or geojson or shp. The "fields" array in the body determines the columns in any csv export. The response is an id to poll the GET /v3/exports/assignments/{id} endpoint is for the URL once the export has completed
 */
export const fetchPostV3ExportsAssignmentsExportSome = (
  variables: PostV3ExportsAssignmentsExportSomeVariables,
  signal?: AbortSignal
) =>
  exportsFetch<
    Responses.Id,
    PostV3ExportsAssignmentsExportSomeError,
    RequestBodies.ExportSomeAssignmentsRequest,
    {},
    {},
    {}
  >({ url: "/v3/exports/assignments/exportSome", method: "post", ...variables, signal });

/**
 * Exports a selection of assignements and associated images given its id as either fwbundle or zipped csv or geojson or shp. The "fields" array in the body determines the columns in any csv export. The response is an id to poll the GET /v3/exports/assignments/{id} endpoint is for the URL once the export has completed
 */
export const usePostV3ExportsAssignmentsExportSome = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.Id,
      PostV3ExportsAssignmentsExportSomeError,
      PostV3ExportsAssignmentsExportSomeVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useExportsContext();
  return reactQuery.useMutation<
    Responses.Id,
    PostV3ExportsAssignmentsExportSomeError,
    PostV3ExportsAssignmentsExportSomeVariables
  >(
    (variables: PostV3ExportsAssignmentsExportSomeVariables) =>
      fetchPostV3ExportsAssignmentsExportSome({ ...fetcherOptions, ...variables }),
    options
  );
};

export type GetV3ExportsAssignmentsIdPathParams = {
  id: string;
};

export type GetV3ExportsAssignmentsIdError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type GetV3ExportsAssignmentsIdVariables = {
  pathParams: GetV3ExportsAssignmentsIdPathParams;
} & ExportsContext["fetcherOptions"];

/**
 * Returns the url for a given id token received from an assignments export request
 */
export const fetchGetV3ExportsAssignmentsId = (variables: GetV3ExportsAssignmentsIdVariables, signal?: AbortSignal) =>
  exportsFetch<Responses.Url, GetV3ExportsAssignmentsIdError, undefined, {}, {}, GetV3ExportsAssignmentsIdPathParams>({
    url: "/v3/exports/assignments/{id}",
    method: "get",
    ...variables,
    signal
  });

/**
 * Returns the url for a given id token received from an assignments export request
 */
export const useGetV3ExportsAssignmentsId = <TData = Responses.Url>(
  variables: GetV3ExportsAssignmentsIdVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Responses.Url, GetV3ExportsAssignmentsIdError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useExportsContext(options);
  return reactQuery.useQuery<Responses.Url, GetV3ExportsAssignmentsIdError, TData>(
    queryKeyFn({ path: "/v3/exports/assignments/{id}", operationId: "getV3ExportsAssignmentsId", variables }),
    ({ signal }) => fetchGetV3ExportsAssignmentsId({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions
    }
  );
};

export type QueryOperation =
  | {
      path: "/v3/exports/reports/{id}";
      operationId: "getV3ExportsReportsId";
      variables: GetV3ExportsReportsIdVariables;
    }
  | {
      path: "/v3/exports/areas/{id}";
      operationId: "getV3ExportsAreasId";
      variables: GetV3ExportsAreasIdVariables;
    }
  | {
      path: "/v3/exports/assignments/{id}";
      operationId: "getV3ExportsAssignmentsId";
      variables: GetV3ExportsAssignmentsIdVariables;
    };
