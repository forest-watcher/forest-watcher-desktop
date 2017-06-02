// Map
export const MAP_MIN_ZOOM = 2;
export const MAP_INITIAL_ZOOM = 3;
export const BASEMAP_TILE = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const MAP_CENTER = [51.505, -0.09];
export const BASEMAP_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

// Leaflet Draw
export const DRAW_CONTROL_FULL = {
  position: 'topright',
  draw: {
      polyline: false,
      polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
              color: '#e1e100', // Color the shape will turn when intersects
              message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
              color: '#bada55'
          }
      },
      circle: false,
      rectangle: {
          shapeOptions: {
              clickable: false
          }
      },
      marker: false
  },
  edit: {
      featureGroup: {}, //REQUIRED
      remove: true
  }
};
export const DRAW_CONTROL_EDIT = {
  position: 'topright',
  draw: {
      polyline: false,
      polygon: false,
      circle: false,
      rectangle: false,
      marker: false
  },
  edit: {
      featureGroup: {}, //REQUIRED
      remove: true
  }
};

export default { MAP_MIN_ZOOM, MAP_INITIAL_ZOOM, BASEMAP_TILE, MAP_CENTER, BASEMAP_ATTRIBUTION, DRAW_CONTROL_FULL, DRAW_CONTROL_EDIT };
