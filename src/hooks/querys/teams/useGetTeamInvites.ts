import { useQueryClient } from "@tanstack/react-query";
import { useGetV3GfwTeamsMyinvites } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
import { useAccessToken } from "hooks/useAccessToken";

const useGetTeamInvites = () => {
  const { httpAuthHeader } = useAccessToken();

  const { data, ...rest } = useGetV3GfwTeamsMyinvites({
    headers: httpAuthHeader
  });

  // Remove nested data property
  return { data: data?.data, ...rest };
};

export const useInvalidateGetTeamInvites = () => {
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

  return async () =>
    await queryClient.invalidateQueries(
      queryKeyFn({
        path: "/v3/gfw/teams/myinvites",
        operationId: "getV3GfwTeamsMyinvites",
        variables: {}
      })
    );
};

export default useGetTeamInvites;
