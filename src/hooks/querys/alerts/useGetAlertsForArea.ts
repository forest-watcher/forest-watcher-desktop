import { useQueries } from "@tanstack/react-query";
import { allDeforestationAlerts } from "constants/alerts";
import useFindArea from "hooks/useFindArea";
import { alertsService } from "services/alerts";

const useGetAlertsForArea = (
  areaId?: string,
  alertTypesToShow = allDeforestationAlerts,
  alertRequestThreshold?: number
) => {
  const { area } = useFindArea(areaId);

  return useQueries({
    queries: alertTypesToShow.map(alertTypeKey => ({
      queryKey: ["areaAlerts", areaId, alertTypeKey, alertRequestThreshold],
      queryFn: () => alertsService.getAlertForArea(area, alertTypeKey, alertRequestThreshold) as Promise<any>,
      enabled: !!area,
      staleTime: 1000 * 60 * 30 // 30 Minutes - Alert Data is accurate for the last 30 minutes
    }))
  });
};

export default useGetAlertsForArea;
