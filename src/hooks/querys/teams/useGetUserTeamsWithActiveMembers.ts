import { TeamsResponse } from "generated/core/coreResponses";
import useGetUserTeams from "hooks/querys/teams/useGetUserTeams";
import useGetUserId from "hooks/useGetUserId";
import { useMemo } from "react";

const useGetUserTeamsWithActiveMembers = ({ shouldExcludeUser = true } = {}) => {
  const userId = useGetUserId();
  const { data, ...rest } = useGetUserTeams();

  const filteredTeams = useMemo(
    () =>
      data?.reduce<TeamsResponse["data"]>((acc, team) => {
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
    [data, shouldExcludeUser, userId]
  );

  return { data: filteredTeams, ...rest };
};

export default useGetUserTeamsWithActiveMembers;
