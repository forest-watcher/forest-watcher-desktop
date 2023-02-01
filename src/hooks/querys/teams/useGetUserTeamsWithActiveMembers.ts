import { useGetV3GfwTeamsUserUserId } from "generated/core/coreComponents";
import { TeamsResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { useMemo } from "react";

// ToDo: move this is the Get User Teams hook
const useGetUserTeamsWithActiveMembers = ({ shouldExcludeUser = true } = {}) => {
  const { httpAuthHeader } = useAccessToken();
  const userId = useGetUserId();
  const { data, ...rest } = useGetV3GfwTeamsUserUserId({
    headers: httpAuthHeader,
    pathParams: { userId }
  });

  const filteredTeams = useMemo(
    () =>
      data?.data?.reduce<TeamsResponse["data"]>((acc, team) => {
        if (!team?.attributes?.members) return acc; // Should never get here

        let teamMembers = shouldExcludeUser
          ? team.attributes.members.filter(member => member.userId !== userId)
          : [...team.attributes.members];

        teamMembers = teamMembers.filter(member => member.status === "confirmed" && member.role !== "left");

        if (teamMembers.length === 0) return acc;

        return [
          ...acc!,
          {
            ...team,
            attributes: {
              ...team.attributes,
              members: teamMembers
            }
          }
        ];
      }, []),
    [data?.data, shouldExcludeUser, userId]
  );

  return { data: filteredTeams, ...rest };
};

export default useGetUserTeamsWithActiveMembers;
