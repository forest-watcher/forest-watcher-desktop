import { useQueryClient } from "@tanstack/react-query";
import {
  GetV3GfwAreaTeamsAreaIdError,
  GetV3GfwTeamsTeamIdError,
  fetchGetV3GfwAreaTeamsAreaId,
  fetchGetV3GfwTeamsTeamId
} from "generated/core/coreComponents";
import { TeamResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";
import * as reactQuery from "@tanstack/react-query";

interface fetchVariables {
  pathParams: { areaId: string };
  headers?: HeadersInit;
}

const fetchAllTeamsByAreaId = (variables: fetchVariables, signal?: AbortSignal) => {
  return new Promise<TeamResponse[]>(async (resolve, reject) => {
    let teamIds: string[] = [];
    const teams: TeamResponse[] = [];
    try {
      // Get area team ids first
      // @ts-ignore incorrect docs
      teamIds = await fetchGetV3GfwAreaTeamsAreaId(variables, signal);

      // @ts-ignore incorrect docs
    } catch (err) {
      reject(err);
    }

    for (const id of teamIds) {
      try {
        const team = await fetchGetV3GfwTeamsTeamId({ pathParams: { teamId: id }, headers: variables.headers });
        teams.push(team);
      } catch (err) {
        // ignore for now, get what we can
        // some might 404 due to fetchGetV3GfwAreaTeamsAreaId returning ids no longer part of that area
      }
    }

    resolve(teams);
  });
};

const useGetAreaTeams = (
  areaId: string,
  options?: Omit<
    reactQuery.UseQueryOptions<TeamResponse[], GetV3GfwAreaTeamsAreaIdError | GetV3GfwTeamsTeamIdError, TeamResponse[]>,
    "queryKey" | "queryFn"
  >
) => {
  const { httpAuthHeader } = useAccessToken();

  return reactQuery.useQuery<TeamResponse[], GetV3GfwAreaTeamsAreaIdError | GetV3GfwTeamsTeamIdError, TeamResponse[]>(
    [`getAreaTeams-${areaId}`],
    ({ signal }) => fetchAllTeamsByAreaId({ pathParams: { areaId }, headers: httpAuthHeader }, signal),
    options
  );
};

export const useInvalidateGetAreaTeams = () => {
  const queryClient = useQueryClient();

  return async (areaId: string) => {
    await queryClient.invalidateQueries([`getAreaTeams-${areaId}`]);
  };
};

export default useGetAreaTeams;
