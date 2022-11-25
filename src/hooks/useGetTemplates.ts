import { useGetV3GfwTemplatesLatest, useGetV3GfwTemplatesPublic } from "generated/core/coreComponents";
import { useMemo } from "react";
import { useAccessToken } from "./useAccessToken";

const useGetTemplates = () => {
  const { httpAuthHeader } = useAccessToken();

  // Queries
  const { data: templatesLatestData, isLoading: templatesLatestLoading } = useGetV3GfwTemplatesLatest(
    { headers: httpAuthHeader },
    { cacheTime: 0, retryOnMount: true }
  );

  const { data: templatesPublicData, isLoading: templatesLoading } = useGetV3GfwTemplatesPublic(
    { headers: httpAuthHeader },
    { cacheTime: 0, retryOnMount: true }
  );

  const templates = useMemo(() => {
    if (!templatesLatestData?.data || !templatesPublicData?.data) {
      return [];
    }

    return [...templatesPublicData.data, ...templatesLatestData.data];
  }, [templatesLatestData, templatesPublicData]);

  return { templates, isLoading: templatesLatestLoading || templatesLoading };
};

export default useGetTemplates;
