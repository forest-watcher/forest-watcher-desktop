import React from 'react';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw';

const MAP_MIN_ZOOM = 2;
const MAP_INITIAL_ZOOM = 3;
const BASEMAP_TILE = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const MAP_CENTER = [51.505, -0.09];
const BASEMAP_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

const editableLayers = new L.FeatureGroup();
const drawControlFull = {
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
      featureGroup: editableLayers, //REQUIRED
      remove: true
  }
};
const drawControlEdit = {
  position: 'topright',
  draw: {
      polyline: false,
      polygon: false,
      circle: false,
      rectangle: false,
      marker: false
  },
  edit: {
      featureGroup: editableLayers, //REQUIRED
      remove: true
  }
};

class Map extends React.Component {

  componentDidMount() {
    this.initMap();
    this.initLayers();

    if (this.props.editable) {
      this.initDrawing();
    }
  }

  componentWillUnmount() {
    this.remove();
  }

  onDrawEventComplete(e) {
    const layer = e.layer;
    editableLayers.addLayer(layer);

    if (Object.keys(editableLayers._layers).length > 0) {
      this.drawControlFull.remove(this.map);
      this.drawControlEdit.addTo(this.map);
    }
  }

  onDrawEventDelete(e) {
    const layer = e.layer;
    editableLayers.removeLayer(layer);

    if (Object.keys(editableLayers._layers).length < 1) {
      this.drawControlEdit.remove(this.map);
      this.drawControlFull.addTo(this.map);
    }
  }

  initMap() {
    this.map = L.map('map', {
      minZoom: MAP_MIN_ZOOM,
      zoom: MAP_INITIAL_ZOOM,
      center: MAP_CENTER,
      detectRetina: true
    });

    this.map.attributionControl.addAttribution(BASEMAP_ATTRIBUTION);
    this.map.zoomControl.setPosition('topright');
    this.map.scrollWheelZoom.disable();
    this.tileLayer = L.tileLayer(BASEMAP_TILE).addTo(this.map).setZIndex(0);
  }

  initLayers() {
    this.map.addLayer(editableLayers);
  }

  initDrawing() {
    this.drawControlFull = new L.Control.Draw(drawControlFull);
    this.drawControlEdit = new L.Control.Draw(drawControlEdit);

    this.map.addControl(this.drawControlFull);

    this.map.on(L.Draw.Event.CREATED, (e) => {
      this.onDrawEventComplete(e);
    });

    this.map.on(L.Draw.Event.DELETED, (e) => {
      this.onDrawEventDelete(e);
    });
  }

  remove() {
    this.map.remove();
  }

  render() {
    return (
      <div id="map" className="c-map"></div>
    );
  }
}

export default Map;
