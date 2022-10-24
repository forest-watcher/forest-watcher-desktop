import { useQueries } from "@tanstack/react-query";
import { allDeforestationAlerts } from "constants/alerts";
import useFindArea from "hooks/useFindArea";
import { alertsService } from "services/alerts";

const useGetAlertsForArea = (areaId?: string, alertTypesToShow = allDeforestationAlerts) => {
  const area = useFindArea(areaId);

  return useQueries({
    queries: alertTypesToShow.map(alertTypeKey => ({
      queryKey: ["areaAlerts", alertTypeKey, areaId],
      queryFn: () => alertsService.getAlertForArea(area, alertTypeKey) as Promise<any>,
      enabled: !!area,
      staleTime: 1000 * 60 * 30 // 30 Minutes - Alert Data is accurate for the last 30 minutes
    }))
  });
};

export default useGetAlertsForArea;
