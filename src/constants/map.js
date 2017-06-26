import L from 'leaflet';

// Map
export const MAP_CONFIG = {
  minZoom: 2,
  initialZoom: 3,
  basemap: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  center: [51.505, -0.09],
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  zoomControl: false
}

export const POLYGON_STYLES = {
  color: '#ffffff',
  opacity: 1,
  fillColor: '#97be32',
  fillOpacity: 0.5,
  weight: 2
};

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
        shapeOptions: POLYGON_STYLES,
        showArea: true,
        metric: true,
        icon: new L.DivIcon({
    			iconSize: new L.Point(12, 12),
    			className: 'leaflet-div-icon leaflet-editing-icon'
    		})
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

export const DRAW_CONTROL_DISABLED = {
  position: 'topright',
  draw: {
      polyline: false,
      polygon: false,
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

export const AREAS = {
  maxSize: 1500000000 // square meters
}

export default { MAP_CONFIG, DRAW_CONTROL, DRAW_CONTROL_DISABLED, AREAS };
