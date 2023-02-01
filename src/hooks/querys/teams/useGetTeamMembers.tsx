import { useQueries } from "@tanstack/react-query";
import { fetchGetV3GfwTeamsTeamIdUsers } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
import { TeamMembersResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";

export type TeamMembersWithTeamIdResponse = {
  members: TeamMembersResponse["data"];
  teamId: string;
};

const useGetTeamMembers = (teamIds: string[]) => {
  const { httpAuthHeader } = useAccessToken();
  const { queryKeyFn } = useCoreContext();

  const fetchTeamMembers = (teamId: string) => async (): Promise<TeamMembersWithTeamIdResponse> => {
    const res = await fetchGetV3GfwTeamsTeamIdUsers({
      headers: httpAuthHeader,
      pathParams: {
        teamId
      }
    });

    return { members: res.data, teamId };
  };

  return useQueries({
    // @ts-ignore remove any duplicate Ids
    queries: [...new Set(teamIds)]
      // Remove any undefined values
      .filter(n => n !== undefined)
      .map(teamId => ({
        queryKey: queryKeyFn({
          path: "/v3/gfw/teams/{teamId}/users",
          operationId: "getV3GfwTeamsTeamIdUsers",
          // @ts-ignore ignore types here
          variables: { pathParams: { teamId } }
        }),
        queryFn: fetchTeamMembers(teamId)
      }))
  });
};

export default useGetTeamMembers;
