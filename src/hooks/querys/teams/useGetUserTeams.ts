import { useQueryClient } from "@tanstack/react-query";
import { useGetV3GfwTeamsUserUserId } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { useMemo } from "react";

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
      staleTime: 1000 * 60 // 1 minutes
    }
  );

  /**
   * Find all the Teams the current logged-in user manages
   * If the user is either an "administrator" or "manager", they are considered as a manager
   */
  const managedTeams = useMemo(
    () =>
      data?.data?.filter(
        team => team.attributes?.userRole === "administrator" || team.attributes?.userRole === "manager"
      ) || [],
    [data]
  );

  /**
   * Find all the teams the current logged-in user is a member of but not a manager
   */
  const joinedTeams = useMemo(
    () =>
      data?.data?.filter(
        team => team.attributes?.userRole !== "administrator" && team.attributes?.userRole !== "manager"
      ) || [],
    [data]
  );

  // Remove nested data property
  return { data: data?.data, managedTeams, joinedTeams, ...rest };
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
