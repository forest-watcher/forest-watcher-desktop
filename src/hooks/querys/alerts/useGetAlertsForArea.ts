import { allDeforestationAlerts, DefaultRequestThresholds } from "constants/alerts";
import { useGetV3AlertsGeostoreId } from "generated/alerts/alertsComponents";
import { Alerts } from "generated/alerts/alertsSchemas";
import { useAccessToken } from "hooks/useAccessToken";
import useFindArea from "hooks/useFindArea";

const useGetAlertsForArea = (
  areaId?: string,
  alertTypesToShow = allDeforestationAlerts,
  alertRequestThreshold: number = DefaultRequestThresholds[0].requestThreshold
) => {
  const { httpAuthHeader } = useAccessToken();

  const { area } = useFindArea(areaId);

  const { data, ...rest } = useGetV3AlertsGeostoreId(
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
      staleTime: 1000 * 60 * 30 // 30 Minutes - Alert Data is accurate for the last 30 minutes
    }
  );

  // Remove nested data property // ToDo: remove `as` when docs match response
  return { data: data as Alerts[], ...rest };
};

export default useGetAlertsForArea;
