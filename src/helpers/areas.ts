import { AREAS } from "../constants/map";
import { RootState } from "store";

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
  return areaId ? state.areas.data[areaId] : null;
};
