import { useQueryClient } from "@tanstack/react-query";
import { useGetV3GfwTeamsUserUserId } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";

const useGetUserTeams = () => {
  const userId = useGetUserId();

  const { httpAuthHeader } = useAccessToken();
  const { data, ...rest } = useGetV3GfwTeamsUserUserId(
    {
      pathParams: {
        userId
      },
      headers: httpAuthHeader
    },
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  );

  // Remove nested data property
  return { data: data?.data, ...rest };
};

export const useInvalidateGetUserTeams = () => {
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

  const userId = useGetUserId();

  /**
   * Invalidate the GetV3GfwTeamsUserUserId cache
   * If a teamId is passed, invalidate the GetV3GfwTeamsTeamId cache too
   */
  return async (teamId?: string) => {
    await queryClient.invalidateQueries(
      queryKeyFn({
        path: "/v3/gfw/teams/user/{userId}",
        operationId: "getV3GfwTeamsUserUserId",
        variables: {
          pathParams: {
            userId
          }
        }
      })
    );

    if (teamId) {
      await queryClient.invalidateQueries(
        queryKeyFn({
          path: "/v3/gfw/teams/{teamId}",
          operationId: "getV3GfwTeamsTeamId",
          variables: {
            pathParams: {
              teamId
            }
          }
        })
      );
    }
  };
};

export default useGetUserTeams;
