import { useQueryClient } from "@tanstack/react-query";
import { useGetV3GfwAreasAreaId } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
import { useAccessToken } from "hooks/useAccessToken";

const useGetAreaById = (areaId?: string) => {
  const { httpAuthHeader } = useAccessToken();

  const { data, ...rest } = useGetV3GfwAreasAreaId(
    {
      pathParams: { areaId: areaId! },
      headers: httpAuthHeader
    },
    {
      enabled: !!areaId
    }
  );

  // Remove nested data property
  return { data: data?.data, ...rest };
};

export const useInvalidateGetAreaById = () => {
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

  return async (areaId: string) => {
    await queryClient.invalidateQueries(
      queryKeyFn({
        path: "/v3/gfw/areas/{areaId}",
        operationId: "getV3GfwAreasAreaId",
        variables: { pathParams: { areaId } }
      })
    );
  };
};

export default useGetAreaById;
