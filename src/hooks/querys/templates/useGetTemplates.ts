import { useGetV3GfwTemplatesLatest, useGetV3GfwTemplatesPublic } from "generated/core/coreComponents";
import { useMemo } from "react";
import { useAccessToken } from "hooks/useAccessToken";
import { useQueryClient } from "@tanstack/react-query";
import { useCoreContext } from "generated/core/coreContext";

const useGetTemplates = () => {
  const { httpAuthHeader } = useAccessToken();

  // Queries
  const { data: templatesLatestData, isLoading: templatesLatestLoading } = useGetV3GfwTemplatesLatest(
    { headers: httpAuthHeader },
    {
      staleTime: 1000 * 60, // 1 minute
      retryOnMount: true
    }
  );

  const { data: templatesPublicData, isLoading: templatesLoading } = useGetV3GfwTemplatesPublic(
    { headers: httpAuthHeader },
    {
      staleTime: 1000 * 60, // 1 minute
      retryOnMount: true
    }
  );

  const templates = useMemo(() => {
    return [...(templatesPublicData?.data || []), ...(templatesLatestData?.data || [])];
  }, [templatesLatestData, templatesPublicData]);

  return { templates, isLoading: templatesLatestLoading || templatesLoading };
};

export const useInvalidateGetTemplates = () => {
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

  return async () => {
    await queryClient.invalidateQueries(
      queryKeyFn({ path: "/v3/gfw/templates/latest", operationId: "getV3GfwTemplatesLatest", variables: {} })
    );

    await queryClient.invalidateQueries(
      queryKeyFn({ path: "/v3/gfw/templates/public", operationId: "getV3GfwTemplatesPublic", variables: {} })
    );
  };
};

export default useGetTemplates;
