import { useGetV3GfwAreasAreaId } from "generated/core/coreComponents";
import { useMemo } from "react";
import { useAccessToken } from "./useAccessToken";

const useFindArea = (areaId?: string) => {
  const { httpAuthHeader } = useAccessToken();

  const { data } = useGetV3GfwAreasAreaId(
    { pathParams: { areaId: areaId || "" }, headers: httpAuthHeader },
    { enabled: Boolean(areaId) }
  );

  const area = useMemo(() => {
    if (!data || !data.data) {
      return null;
    }

    return data.data;
  }, [data]);

  return area;
};

export default useFindArea;
