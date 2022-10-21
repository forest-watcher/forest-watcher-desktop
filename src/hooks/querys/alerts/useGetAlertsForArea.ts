import { useQuery } from "@tanstack/react-query";
import useFindArea from "hooks/useFindArea";
import { alertsService } from "services/alerts";

const useGetAlertsForArea = (areaId?: string) => {
  const area = useFindArea(areaId);

  return useQuery(["areaAlerts", areaId], () => alertsService.getAlertsForArea(area) as Promise<any>, {
    enabled: !!area,
    staleTime: 1000 * 60 * 30 // 30 Minutes - Alert Data is accurate for the last 30 minutes
  });
};

export default useGetAlertsForArea;
