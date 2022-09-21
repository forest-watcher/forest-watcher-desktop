import { useEffect, useMemo, useState } from "react";
import { LngLatBoundsLike, useMap } from "react-map-gl";
import * as turf from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";

const useZoomToGeojson = (selectedAreaGeoData: AllGeoJSON) => {
  const { current: map } = useMap();
  const [hasZoomed, setHasZoomed] = useState(false);

  const bounds = useMemo(() => (selectedAreaGeoData ? turf.bbox(selectedAreaGeoData) : null), [selectedAreaGeoData]);

  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds as LngLatBoundsLike, { padding: 40 });
      setHasZoomed(true);
    }
  }, [map, bounds]);

  return hasZoomed;
};

export default useZoomToGeojson;
