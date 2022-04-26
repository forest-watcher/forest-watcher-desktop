import L from "leaflet";

export const getBoundFromGeoJSON = (geoJSON, padding = [15, 15]) => {
  const countryBounds = geoJSON.coordinates[0].map(pt => [pt[1], pt[0]]);
  const bounds = L.latLngBounds(countryBounds, { padding });
  return bounds;
};
