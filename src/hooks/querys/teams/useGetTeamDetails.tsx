import { useGetV3GfwTeamsTeamId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";

const useGetTeamDetails = (teamId?: string) => {
  const { httpAuthHeader } = useAccessToken();
  const { data, ...rest } = useGetV3GfwTeamsTeamId(
    {
      pathParams: {
        teamId: teamId!
      },
      headers: httpAuthHeader
    },
    {
      enabled: !!teamId,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  );

  // Remove nested data property
  return { data: data?.data, ...rest };
};

export default useGetTeamDetails;
