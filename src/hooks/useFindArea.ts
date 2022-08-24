import { useMemo } from "react";
import { TAreasInTeam, TAreasResponse } from "services/area";

const useFindArea = (areaId: string, userAreas: any, teamAreas: TAreasInTeam[]): TAreasResponse | null => {
  const area = useMemo(() => {
    if (userAreas[areaId]) {
      return userAreas[areaId] as TAreasResponse;
    }

    let found = false;
    let area: TAreasResponse | null = null;

    teamAreas.forEach(teamArea => {
      if (!found) {
        let searchArea = teamArea.areas.find(area => area.data.id === areaId);
        if (searchArea) {
          area = searchArea.data;
          found = true;
        }
      }
    });

    return area;
  }, [areaId, userAreas, teamAreas]);

  return area;
};

export default useFindArea;
