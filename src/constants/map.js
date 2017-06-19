// Map
export const MAP_MIN_ZOOM = 2;
export const MAP_INITIAL_ZOOM = 3;
export const BASEMAP_TILE = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const MAP_CENTER = [51.505, -0.09];
export const BASEMAP_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

// Leaflet Draw
export const DRAW_CONTROL = {
  position: 'topright',
  draw: {
      polyline: false,
      polygon: {
        allowIntersection: false,
        drawError: {
          color: '#f15656',
          message: '<strong>Oh snap!<strong> you can\'t draw that!'
        },
        shapeOptions: {
          color: '#97be32'
        }
      },
      circle: false,
      rectangle: false,
      marker: false
  },
  edit: {
      featureGroup: {},
      remove: true,
      allowIntersection: false
  }
};

export default { MAP_MIN_ZOOM, MAP_INITIAL_ZOOM, BASEMAP_TILE, MAP_CENTER, BASEMAP_ATTRIBUTION, DRAW_CONTROL };
