import { useQueryClient } from "@tanstack/react-query";
import { useGetV3GfwTeamsUserUserId } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";

const useGetUserTeams = () => {
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

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

  const invalidateGetUserTeams = async () =>
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

  // Remove nested data property
  return { data: data?.data, invalidateGetUserTeams, ...rest };
};

export default useGetUserTeams;
