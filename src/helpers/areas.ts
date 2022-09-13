import { AREAS } from "../constants/map";
import { RootState } from "store";
import { TAreasInTeam, TAreasResponse } from "services/area";
import { TeamResponse } from "services/teams";

const geojsonArea = require("@mapbox/geojson-area");

// check area size on draw complete
const checkArea = (area: any) => {
  const areaSize = geojsonArea.geometry(area.geometry);
  if (areaSize <= AREAS.maxSize) {
    return true;
  }
  return false;
};

export { checkArea };

export const readGeojson = (state: RootState, areaId?: string) => {
  const area = areaId ? state.areas.data[areaId] : null;

  const geojson = area ? area.attributes.geostore.geojson : null;
  if (geojson) geojson.properties = {};
  return geojson;
};

export const readArea = (state: RootState, areaId?: string) => {
  return areaId ? (state.areas.data[areaId] as TAreasResponse) : null;
};

export const getNumberOfTeamsInArea = (areaId: string, areasInUsersTeams: TAreasInTeam[]) => {
  let count = 0;
  areasInUsersTeams.forEach(team =>
    team.areas.forEach(area => {
      if (area.data.id === areaId) {
        count++;
      }
    })
  );
  return count;
};

export const getAreaTeams = (areaId: string, areasInUsersTeams: TAreasInTeam[]) => {
  const teams: TeamResponse["data"][] = [];
  areasInUsersTeams.forEach(team =>
    team.areas.forEach(area => {
      if (area.data.id === areaId && !!team.team) {
        //@ts-ignore
        teams.push(team.team);
      }
    })
  );
  return teams;
};
