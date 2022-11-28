/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
import * as reactQuery from "@tanstack/react-query";
import { useClayersContext, ClayersContext } from "./clayersContext";
import type * as Fetcher from "./clayersFetcher";
import { clayersFetch } from "./clayersFetcher";
import type * as RequestBodies from "./clayersRequestBodies";
import type * as Responses from "./clayersResponses";

export type GetContextualLayerQueryParams = {
  /**
   * Filter by the enabled attribute, to retrieve only enabled or disabled layers.
   *
   * @default false
   */
  enabled?: boolean;
};

export type GetContextualLayerError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type GetContextualLayerVariables = {
  queryParams?: GetContextualLayerQueryParams;
} & ClayersContext["fetcherOptions"];

/**
 * This endpoint allows you to list contextual layers and their properties. If successful, the returned response will include a list of contextual layers in the `data` index of the response body, including contextual layers that match one of the following conditions:
 * - the contextual layer is public - isPublic attribute is set to true;
 * - the contextual layer is owned by the user making the request - owner.id attribute matches the user id in the token provided in the request;
 * - the contextual layer is owned by a team you belong to - the contextual layer id is part of the layers of the team the user making the request belongs to.
 * The result is **not** paginated, so you will get all layers that match at least one of the conditions defined above.
 */
export const fetchGetContextualLayer = (variables: GetContextualLayerVariables, signal?: AbortSignal) =>
  clayersFetch<Responses.Layers, GetContextualLayerError, undefined, {}, GetContextualLayerQueryParams, {}>({
    url: "/v1/contextual-layer",
    method: "get",
    ...variables,
    signal
  });

/**
 * This endpoint allows you to list contextual layers and their properties. If successful, the returned response will include a list of contextual layers in the `data` index of the response body, including contextual layers that match one of the following conditions:
 * - the contextual layer is public - isPublic attribute is set to true;
 * - the contextual layer is owned by the user making the request - owner.id attribute matches the user id in the token provided in the request;
 * - the contextual layer is owned by a team you belong to - the contextual layer id is part of the layers of the team the user making the request belongs to.
 * The result is **not** paginated, so you will get all layers that match at least one of the conditions defined above.
 */
export const useGetContextualLayer = <TData = Responses.Layers>(
  variables: GetContextualLayerVariables,
  options?: Omit<reactQuery.UseQueryOptions<Responses.Layers, GetContextualLayerError, TData>, "queryKey" | "queryFn">
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useClayersContext(options);
  return reactQuery.useQuery<Responses.Layers, GetContextualLayerError, TData>(
    queryKeyFn({ path: "/v1/contextual-layer", operationId: "getContextualLayer", variables }),
    ({ signal }) => fetchGetContextualLayer({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions
    }
  );
};

export type PostContextualLayerError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type PostContextualLayerVariables = {
  body: RequestBodies.Layer;
} & ClayersContext["fetcherOptions"];

export const fetchPostContextualLayer = (variables: PostContextualLayerVariables, signal?: AbortSignal) =>
  clayersFetch<Responses.Layer, PostContextualLayerError, RequestBodies.Layer, {}, {}, {}>({
    url: "/v1/contextual-layer",
    method: "post",
    ...variables,
    signal
  });

export const usePostContextualLayer = (
  options?: Omit<
    reactQuery.UseMutationOptions<Responses.Layer, PostContextualLayerError, PostContextualLayerVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useClayersContext();
  return reactQuery.useMutation<Responses.Layer, PostContextualLayerError, PostContextualLayerVariables>(
    (variables: PostContextualLayerVariables) => fetchPostContextualLayer({ ...fetcherOptions, ...variables }),
    options
  );
};

export type PostTeamContextualLayerPathParams = {
  teamId: string;
};

export type PostTeamContextualLayerError = Fetcher.ErrorWrapper<
  | {
      status: 401;
      payload: Responses.Error;
    }
  | {
      status: 403;
      payload: Responses.Error;
    }
>;

export type PostTeamContextualLayerVariables = {
  body: RequestBodies.Layer;
  pathParams: PostTeamContextualLayerPathParams;
} & ClayersContext["fetcherOptions"];

export const fetchPostTeamContextualLayer = (variables: PostTeamContextualLayerVariables, signal?: AbortSignal) =>
  clayersFetch<
    Responses.Layer,
    PostTeamContextualLayerError,
    RequestBodies.Layer,
    {},
    {},
    PostTeamContextualLayerPathParams
  >({ url: "/v1/contextual-layer/team/{teamId}", method: "post", ...variables, signal });

export const usePostTeamContextualLayer = (
  options?: Omit<
    reactQuery.UseMutationOptions<Responses.Layer, PostTeamContextualLayerError, PostTeamContextualLayerVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useClayersContext();
  return reactQuery.useMutation<Responses.Layer, PostTeamContextualLayerError, PostTeamContextualLayerVariables>(
    (variables: PostTeamContextualLayerVariables) => fetchPostTeamContextualLayer({ ...fetcherOptions, ...variables }),
    options
  );
};

export type DeleteV3ContextualLayerDeleteAllUserLayersError = Fetcher.ErrorWrapper<{
  status: 404;
  payload: Responses.Error;
}>;

export type DeleteV3ContextualLayerDeleteAllUserLayersVariables = ClayersContext["fetcherOptions"];

/**
 * Endpoint that deletes every user owned layer
 */
export const fetchDeleteV3ContextualLayerDeleteAllUserLayers = (
  variables: DeleteV3ContextualLayerDeleteAllUserLayersVariables,
  signal?: AbortSignal
) =>
  clayersFetch<undefined, DeleteV3ContextualLayerDeleteAllUserLayersError, undefined, {}, {}, {}>({
    url: "/v3/contextual-layer/deleteAllUserLayers",
    method: "delete",
    ...variables,
    signal
  });

/**
 * Endpoint that deletes every user owned layer
 */
export const useDeleteV3ContextualLayerDeleteAllUserLayers = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      undefined,
      DeleteV3ContextualLayerDeleteAllUserLayersError,
      DeleteV3ContextualLayerDeleteAllUserLayersVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useClayersContext();
  return reactQuery.useMutation<
    undefined,
    DeleteV3ContextualLayerDeleteAllUserLayersError,
    DeleteV3ContextualLayerDeleteAllUserLayersVariables
  >(
    (variables: DeleteV3ContextualLayerDeleteAllUserLayersVariables) =>
      fetchDeleteV3ContextualLayerDeleteAllUserLayers({ ...fetcherOptions, ...variables }),
    options
  );
};

export type PatchContextualLayerPathParams = {
  layerId: string;
};

export type PatchContextualLayerError = Fetcher.ErrorWrapper<
  | {
      status: 401;
      payload: Responses.Error;
    }
  | {
      status: 404;
      payload: Responses.Error;
    }
>;

export type PatchContextualLayerVariables = {
  body: RequestBodies.Layer;
  pathParams: PatchContextualLayerPathParams;
} & ClayersContext["fetcherOptions"];

/**
 * To update the details of an existing contextual layer (either created for a user or a team), you should issue a PATCH request. This endpoint is available to all registered API users.
 *
 * Updating contextual layers also has some caveats:
 * - you can only update the enabled attribute of contextual layers you own, or contextual layers that belong to a team that you manage - if one of these conditions is not met, the enabled attribute value is kept as is.
 * - you can only update the isPublic attribute of contextual layers if you are an ADMIN user and thecontextual layer you are trying to update is owned by a user (not by a team) - in all other cases, the isPublic attribute value is kept as is.
 */
export const fetchPatchContextualLayer = (variables: PatchContextualLayerVariables, signal?: AbortSignal) =>
  clayersFetch<Responses.Layer, PatchContextualLayerError, RequestBodies.Layer, {}, {}, PatchContextualLayerPathParams>(
    { url: "/v1/contextual-layer/{layerId}", method: "patch", ...variables, signal }
  );

/**
 * To update the details of an existing contextual layer (either created for a user or a team), you should issue a PATCH request. This endpoint is available to all registered API users.
 *
 * Updating contextual layers also has some caveats:
 * - you can only update the enabled attribute of contextual layers you own, or contextual layers that belong to a team that you manage - if one of these conditions is not met, the enabled attribute value is kept as is.
 * - you can only update the isPublic attribute of contextual layers if you are an ADMIN user and thecontextual layer you are trying to update is owned by a user (not by a team) - in all other cases, the isPublic attribute value is kept as is.
 */
export const usePatchContextualLayer = (
  options?: Omit<
    reactQuery.UseMutationOptions<Responses.Layer, PatchContextualLayerError, PatchContextualLayerVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useClayersContext();
  return reactQuery.useMutation<Responses.Layer, PatchContextualLayerError, PatchContextualLayerVariables>(
    (variables: PatchContextualLayerVariables) => fetchPatchContextualLayer({ ...fetcherOptions, ...variables }),
    options
  );
};

export type DeleteContextualLayerPathParams = {
  layerId: string;
};

export type DeleteContextualLayerError = Fetcher.ErrorWrapper<
  | {
      status: 401;
      payload: Responses.Error;
    }
  | {
      status: 404;
      payload: Responses.Error;
    }
>;

export type DeleteContextualLayerVariables = {
  pathParams: DeleteContextualLayerPathParams;
} & ClayersContext["fetcherOptions"];

/**
 * Use this endpoint if you'd like to delete a contextual layer from the RW API. In order to delete a contextual layer, you must either be an `ADMIN` user or, alternatively, meet all of the following conditions:
 * - the contextual layer's `isPublic` property must be set to `false`.
 * - if the contextual layer is owned by a user, you must be the owner of the contextual layer.
 * - if the contextual layer is owned by a team, you must be one of the managers of the team that owns the contextual layer.
 */
export const fetchDeleteContextualLayer = (variables: DeleteContextualLayerVariables, signal?: AbortSignal) =>
  clayersFetch<undefined, DeleteContextualLayerError, undefined, {}, {}, DeleteContextualLayerPathParams>({
    url: "/v1/contextual-layer/{layerId}",
    method: "delete",
    ...variables,
    signal
  });

/**
 * Use this endpoint if you'd like to delete a contextual layer from the RW API. In order to delete a contextual layer, you must either be an `ADMIN` user or, alternatively, meet all of the following conditions:
 * - the contextual layer's `isPublic` property must be set to `false`.
 * - if the contextual layer is owned by a user, you must be the owner of the contextual layer.
 * - if the contextual layer is owned by a team, you must be one of the managers of the team that owns the contextual layer.
 */
export const useDeleteContextualLayer = (
  options?: Omit<
    reactQuery.UseMutationOptions<undefined, DeleteContextualLayerError, DeleteContextualLayerVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useClayersContext();
  return reactQuery.useMutation<undefined, DeleteContextualLayerError, DeleteContextualLayerVariables>(
    (variables: DeleteContextualLayerVariables) => fetchDeleteContextualLayer({ ...fetcherOptions, ...variables }),
    options
  );
};

export type GetLossLayerImagePathParams = {
  startYear: string;
  endYear: string;
  z: string;
  x: string;
  y: string;
};

export type GetLossLayerImageError = Fetcher.ErrorWrapper<{
  status: 401;
  payload: Responses.Error;
}>;

export type GetLossLayerImageVariables = {
  pathParams: GetLossLayerImagePathParams;
} & ClayersContext["fetcherOptions"];

/**
 * Use this endpoint to retrieve PNG image corresponding to the loss layer tiles for the `(x,y,z)` tuple (where `x` represents latitude, `y` longitude, and `z` the zoom level) for loss layers for the interval of years from `startYear` to `endYear`.
 */
export const fetchGetLossLayerImage = (variables: GetLossLayerImageVariables, signal?: AbortSignal) =>
  clayersFetch<undefined, GetLossLayerImageError, undefined, {}, {}, GetLossLayerImagePathParams>({
    url: "/v1/contextual-layer/loss-layer/{startYear}/{endYear}/{z}/{x}/{y}.png",
    method: "get",
    ...variables,
    signal
  });

/**
 * Use this endpoint to retrieve PNG image corresponding to the loss layer tiles for the `(x,y,z)` tuple (where `x` represents latitude, `y` longitude, and `z` the zoom level) for loss layers for the interval of years from `startYear` to `endYear`.
 */
export const useGetLossLayerImage = <TData = undefined>(
  variables: GetLossLayerImageVariables,
  options?: Omit<reactQuery.UseQueryOptions<undefined, GetLossLayerImageError, TData>, "queryKey" | "queryFn">
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useClayersContext(options);
  return reactQuery.useQuery<undefined, GetLossLayerImageError, TData>(
    queryKeyFn({
      path: "/v1/contextual-layer/loss-layer/{startYear}/{endYear}/{z}/{x}/{y}.png",
      operationId: "getLossLayerImage",
      variables
    }),
    ({ signal }) => fetchGetLossLayerImage({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions
    }
  );
};

export type GetFwApiHealthcheckError = Fetcher.ErrorWrapper<undefined>;

export type GetFwApiHealthcheckVariables = ClayersContext["fetcherOptions"];

export const fetchGetFwApiHealthcheck = (variables: GetFwApiHealthcheckVariables, signal?: AbortSignal) =>
  clayersFetch<Responses.Healthcheck, GetFwApiHealthcheckError, undefined, {}, {}, {}>({
    url: "/v1/fw_contextual_layers/healthcheck",
    method: "get",
    ...variables,
    signal
  });

export const useGetFwApiHealthcheck = <TData = Responses.Healthcheck>(
  variables: GetFwApiHealthcheckVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Responses.Healthcheck, GetFwApiHealthcheckError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useClayersContext(options);
  return reactQuery.useQuery<Responses.Healthcheck, GetFwApiHealthcheckError, TData>(
    queryKeyFn({ path: "/v1/fw_contextual_layers/healthcheck", operationId: "getFwApiHealthcheck", variables }),
    ({ signal }) => fetchGetFwApiHealthcheck({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions
    }
  );
};

export type DeleteV1ContextualLayerTeamTeamIdCopyError = Fetcher.ErrorWrapper<undefined>;

export type DeleteV1ContextualLayerTeamTeamIdCopyVariables = ClayersContext["fetcherOptions"];

export const fetchDeleteV1ContextualLayerTeamTeamIdCopy = (
  variables: DeleteV1ContextualLayerTeamTeamIdCopyVariables,
  signal?: AbortSignal
) =>
  clayersFetch<undefined, DeleteV1ContextualLayerTeamTeamIdCopyError, undefined, {}, {}, {}>({
    url: "/v1/contextual-layer/team/{teamId} - copy",
    method: "delete",
    ...variables,
    signal
  });

export const useDeleteV1ContextualLayerTeamTeamIdCopy = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      undefined,
      DeleteV1ContextualLayerTeamTeamIdCopyError,
      DeleteV1ContextualLayerTeamTeamIdCopyVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useClayersContext();
  return reactQuery.useMutation<
    undefined,
    DeleteV1ContextualLayerTeamTeamIdCopyError,
    DeleteV1ContextualLayerTeamTeamIdCopyVariables
  >(
    (variables: DeleteV1ContextualLayerTeamTeamIdCopyVariables) =>
      fetchDeleteV1ContextualLayerTeamTeamIdCopy({ ...fetcherOptions, ...variables }),
    options
  );
};

export type PostV3ContextualLayerTeamTeamIdError = Fetcher.ErrorWrapper<
  | {
      status: 401;
      payload: Responses.Error;
    }
  | {
      status: 403;
      payload: Responses.Error;
    }
>;

export type PostV3ContextualLayerTeamTeamIdVariables = {
  body: RequestBodies.Layer;
} & ClayersContext["fetcherOptions"];

/**
 * Create a layer owned by a team
 */
export const fetchPostV3ContextualLayerTeamTeamId = (
  variables: PostV3ContextualLayerTeamTeamIdVariables,
  signal?: AbortSignal
) =>
  clayersFetch<Responses.Layer, PostV3ContextualLayerTeamTeamIdError, RequestBodies.Layer, {}, {}, {}>({
    url: "/v3/contextual-layer/team/{teamId}",
    method: "post",
    ...variables,
    signal
  });

/**
 * Create a layer owned by a team
 */
export const usePostV3ContextualLayerTeamTeamId = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.Layer,
      PostV3ContextualLayerTeamTeamIdError,
      PostV3ContextualLayerTeamTeamIdVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useClayersContext();
  return reactQuery.useMutation<
    Responses.Layer,
    PostV3ContextualLayerTeamTeamIdError,
    PostV3ContextualLayerTeamTeamIdVariables
  >(
    (variables: PostV3ContextualLayerTeamTeamIdVariables) =>
      fetchPostV3ContextualLayerTeamTeamId({ ...fetcherOptions, ...variables }),
    options
  );
};

export type QueryOperation =
  | {
      path: "/v1/contextual-layer";
      operationId: "getContextualLayer";
      variables: GetContextualLayerVariables;
    }
  | {
      path: "/v1/contextual-layer/loss-layer/{startYear}/{endYear}/{z}/{x}/{y}.png";
      operationId: "getLossLayerImage";
      variables: GetLossLayerImageVariables;
    }
  | {
      path: "/v1/fw_contextual_layers/healthcheck";
      operationId: "getFwApiHealthcheck";
      variables: GetFwApiHealthcheckVariables;
    };
