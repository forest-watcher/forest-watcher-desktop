import { AREAS } from '../constants/map';

const geojsonArea = require('@mapbox/geojson-area');

// check area size on draw complete
const checkArea = (area) => {
    const areaSize = geojsonArea.geometry(area.geometry);
    if (areaSize <= AREAS.maxSize) {
      return true;
    }
    return false;
}

export { checkArea };