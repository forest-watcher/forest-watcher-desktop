import { useGetV3GfwTeamsMyinvites } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";

const useGetTeamInvites = () => {
  const { httpAuthHeader } = useAccessToken();

  const { data, ...rest } = useGetV3GfwTeamsMyinvites({
    headers: httpAuthHeader
  });

  // Remove nested data property
  return { data: data?.data, ...rest };
};

export default useGetTeamInvites;
