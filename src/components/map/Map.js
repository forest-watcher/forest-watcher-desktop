import React from 'react';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { MAP_MIN_ZOOM, MAP_INITIAL_ZOOM, MAP_CENTER, BASEMAP_ATTRIBUTION, BASEMAP_TILE, DRAW_CONTROL_FULL, DRAW_CONTROL_EDIT } from '../../constants/map';

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
    this.featureGroup.addLayer(layer);
    this.drawControlFull.remove(this.map);
    this.drawControlEdit.addTo(this.map);
    this.props.onPolygonComplete && this.props.onPolygonComplete(this.featureGroup);
  }

  onDrawEventDelete(e) {
    const layer = e.layer;
    this.featureGroup.removeLayer(layer);

    if (this.featureGroup.getLayers().length === 0) {
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

    this.featureGroup = new L.FeatureGroup();
  }

  initLayers() {
    this.map.addLayer(this.featureGroup);
  }

  initDrawing() {
    const drawControlFull = Object.assign(DRAW_CONTROL_FULL, {
      edit: {
        featureGroup: this.featureGroup,
        remove: true
      }
    });
    const drawControlEdit = Object.assign(DRAW_CONTROL_EDIT,{
      edit: {
        featureGroup: this.featureGroup,
        remove: true
      }
    });
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
