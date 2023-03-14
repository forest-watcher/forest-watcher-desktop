import { useGetV3GfwTeamsTeamId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { useMemo } from "react";

const useGetTeamDetails = (teamId?: string) => {
  const userId = useGetUserId();
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
      staleTime: 1000 * 60 // 1 minutes
    }
  );

  /**
   * Find the Current "administrator" for the team
   */
  const admin = useMemo(
    () => data?.data?.attributes?.members?.filter(member => member.role === "administrator") || [],
    [data]
  );

  /**
   * Find the Current "managers" for the team
   * If a member is either an "administrator" or "manager", they are considered as a manager
   */
  const managers = useMemo(
    () =>
      data?.data?.attributes?.members?.filter(member => member.role === "administrator" || member.role === "manager") ||
      [],
    [data]
  );

  /**
   * Find the Current "monitors" for the team
   */
  const monitors = useMemo(
    () =>
      data?.data?.attributes?.members?.filter(member => member.role !== "administrator" && member.role !== "manager") ||
      [],
    [data]
  );

  /**
   * Find out if the current logged-in user is an Admin and/or Manager for the team
   * If the user is an Admin they are also considered a Manager
   */
  const [userIsAdmin, userIsManager] = useMemo(() => {
    const userMemberInfo = data?.data?.attributes?.members?.find(member => member.userId === userId);

    if (!userMemberInfo) {
      return [false, false];
    }

    return [
      userMemberInfo.role === "administrator",
      userMemberInfo.role === "administrator" || userMemberInfo.role === "manager"
    ];
  }, [data, userId]);

  // Remove nested data property
  return { data: data?.data, admin, managers, monitors, userIsAdmin, userIsManager, ...rest };
};

export default useGetTeamDetails;
