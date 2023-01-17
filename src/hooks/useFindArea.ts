import { useGetV3GfwAreasAreaId } from "generated/core/coreComponents";
import { useMemo } from "react";
import { useAccessToken } from "./useAccessToken";

const useFindArea = (areaId?: string) => {
  const { httpAuthHeader } = useAccessToken();

  const resp = useGetV3GfwAreasAreaId(
    { pathParams: { areaId: areaId || "" }, headers: httpAuthHeader },
    { enabled: Boolean(areaId) }
  );

  const area = useMemo(() => {
    if (!resp.data || !resp.data.data) {
      return null;
    }

    return resp.data.data;
  }, [resp.data]);

  return { area, resp };
};

export default useFindArea;
