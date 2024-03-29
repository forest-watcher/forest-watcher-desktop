import { GetV3GfwAreasUserandteamError, useGetV3GfwAreasUserandteam } from "generated/core/coreComponents";
import type * as Responses from "generated/core/coreResponses";
import { AreaModel } from "generated/core/coreSchemas";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { useCallback, useMemo } from "react";
import * as reactQuery from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCoreContext } from "generated/core/coreContext";

export type TAreasByTeam = {
  team?: string;
  areas?: {
    data: {
      id?: string | undefined;
      type?: string | undefined;
      attributes?: AreaModel | undefined;
    };
  }[];
}[];

const useGetAreas = (
  options?: Omit<
    reactQuery.UseQueryOptions<Responses.AreasResponse, GetV3GfwAreasUserandteamError, Responses.AreasResponse>,
    "queryKey" | "queryFn"
  >
) => {
  const userId = useGetUserId();
  const { httpAuthHeader } = useAccessToken();
  const { data: areaList, ...rest } = useGetV3GfwAreasUserandteam(
    { headers: httpAuthHeader },
    { refetchOnWindowFocus: false, ...options }
  );

  const userAreas = useMemo(() => {
    return (
      areaList?.data
        ?.filter(area => area.attributes?.userId === userId)
        .filter((value, index, self) => self.findIndex(t => t.id === value.id) === index) || []
    );
  }, [areaList?.data, userId]);

  const areasByTeam = useMemo<TAreasByTeam>(() => {
    // Get each team.
    const teams =
      areaList?.data
        ?.map(area => area.attributes?.teams)
        .flat()
        // @ts-ignore incorrect typings
        .filter((value, index, self) => self.findIndex(t => t.id === value.id) === index) || [];

    const byTeam = teams?.map(team => {
      return {
        team,
        // @ts-ignore incorrect typings
        areas: areaList?.data?.filter(area => area.attributes?.teamId === team?.id).map(area => ({ data: area }))
      };
    });

    return byTeam;
  }, [areaList?.data]);

  const getTeamNamesByAreaId = useCallback(
    (areaId: string) => {
      const teams: string[] = [];
      areasByTeam.forEach(({ team, areas }) =>
        areas?.forEach(area => {
          if (area.data.id === areaId && !!team) {
            // @ts-ignore incorrect typings
            teams.push(team.name);
          }
        })
      );

      return teams;
    },
    [areasByTeam]
  );

  return { data: { userAreas, areasByTeam, unfilteredAreas: areaList, getTeamNamesByAreaId }, ...rest };
};

export const useInvalidateGetAreas = () => {
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

  return async () => {
    await queryClient.invalidateQueries(
      queryKeyFn({
        path: "/v3/gfw/areas/userAndTeam",
        operationId: "getV3GfwAreasUserandteam",
        variables: {}
      })
    );
  };
};

export default useGetAreas;
