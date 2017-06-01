import React from 'react';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw';

const MAP_MIN_ZOOM = 2;
const MAP_INITIAL_ZOOM = 1;
const BASEMAP_TILE = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const MAP_CENTER = [51.505, -0.09];
const BASEMAP_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

class Map extends React.Component {

  componentDidMount() {
    this.initMap();
  }

  componentWillUnmount() {
    this.remove();
  }

  enableDrawing() {
    const editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

    var options = {
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
          circle: false, // Turns off this drawing tool
          rectangle: {
              shapeOptions: {
                  clickable: false
              }
          },
          marker: false
      },
      edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: true
      }
    };

    const drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
          layer = e.layer;

      if (type === 'marker') {
          layer.bindPopup('A popup!');
      }

      editableLayers.addLayer(layer);
    });
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

    this.enableDrawing();
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
