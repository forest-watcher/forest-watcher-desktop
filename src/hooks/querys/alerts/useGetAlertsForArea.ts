import { allDeforestationAlerts, DefaultRequestThresholds } from "constants/alerts";
import { useGetV3AlertsGeostoreId } from "generated/alerts/alertsComponents";
import { Alerts } from "generated/alerts/alertsSchemas";
import { sortAlertsInAscendingOrder } from "helpers/alerts";
import { useAccessToken } from "hooks/useAccessToken";
import useFindArea from "hooks/useFindArea";
import { useMemo } from "react";

const useGetAlertsForArea = (
  areaId?: string,
  alertTypesToShow = allDeforestationAlerts,
  alertRequestThreshold: number = DefaultRequestThresholds[0].requestThreshold
) => {
  const { httpAuthHeader } = useAccessToken();

  const { area } = useFindArea(areaId);

  // ToDo: src/generated/alerts/alertsResponses.ts Alerts Response is wrongly typed
  const { data: { data } = {}, ...rest } = useGetV3AlertsGeostoreId<{ data: Alerts[] }>(
    {
      pathParams: {
        geostoreId: area?.attributes?.geostore?.id!
      },
      queryParams: {
        // @ts-ignore wrong type, can be an array of datasets
        dataset: alertTypesToShow,
        minDate: alertRequestThreshold
      },
      headers: httpAuthHeader
    },
    {
      enabled: !!area,
      // Alert Data is accurate for the last day. No need to re-fetch alert data within the same user session
      staleTime: Infinity
    }
  );

  const allAlerts = useMemo(() => {
    if (!data || !data.length) return [];

    // Sort in ascending order
    const sortedAlerts = sortAlertsInAscendingOrder(data);

    // Limit the number of alerts displayed at any one time to 5000
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    // > "new array object selected from start to end (end not included)"
    return sortedAlerts.slice(0, 5000);
  }, [data]);

  return { data: allAlerts, ...rest };
};

export default useGetAlertsForArea;
