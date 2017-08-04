import L from 'leaflet';

// Map
export const MAP_CONFIG = {
  minZoom: 2,
  initialZoom: 3,
  basemap: `http://a.tile.openstreetmap.org/{z}/{x}/{y}.png`,
  center: [51.505, -0.09],
  attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  zoomControl: false
}

export const POLYGON_STYLES = {
  color: '#ffffff',
  opacity: 1,
  fillColor: '#97be32',
  fillOpacity: 0.5,
  weight: 2
};

export const POLYGON_STYLES_ERROR = {
  color: '#ffffff',
  opacity: 1,
  fillColor: '#f15656',
  fillOpacity: 0.5,
  weight: 2
};

export const BLOB_CONFIG = {
  style: {
    width: '100%',
    height: '100%',
    position: 'relative'
  }
}

// Leaflet Draw
export const DRAW_CONTROL = {
  position: 'topright',
  draw: {
      polyline: false,
      polygon: {
        allowIntersection: false,
        drawError: {
          color: '#f15656',
          message: "You can draw an area that intersects"
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

export default { MAP_CONFIG, BLOB_CONFIG, POLYGON_STYLES, POLYGON_STYLES_ERROR, DRAW_CONTROL, DRAW_CONTROL_DISABLED, AREAS };
