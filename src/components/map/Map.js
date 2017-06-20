import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw'; // eslint-disable-line no-unused-vars
import { leafletSearch } from 'leaflet-search'; // eslint-disable-line no-unused-vars
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-search/dist/leaflet-search.min.css';
import { MAP_MIN_ZOOM, MAP_INITIAL_ZOOM, MAP_CENTER, BASEMAP_ATTRIBUTION, BASEMAP_TILE, DRAW_CONTROL } from '../../constants/map';

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
    this.props.onDrawComplete && this.props.onDrawComplete(this.featureGroup.getLayers()[0].toGeoJSON());
  }

  onDrawEventDelete(e) {
    const layer = e.layer;
    this.featureGroup.removeLayer(layer);
    this.props.onDrawComplete && this.props.onDrawComplete();
    if (this.featureGroup.getLayers().length === 0) {
      this.enablePolygonDraw();
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
    this.map.scrollWheelZoom.disable();
    this.tileLayer = L.tileLayer(BASEMAP_TILE).addTo(this.map).setZIndex(0);

    this.featureGroup = new L.FeatureGroup();

    this.searchLayer = L.layerGroup().addTo(this.map);
    this.map.addControl(new L.Control.Search({
      layer: this.searchLayer,
      position: 'topright'
    }));
    this.map.zoomControl.setPosition('topright');
  }

  initLayers() {
    this.map.addLayer(this.featureGroup);
  }

  enablePolygonDraw() {
    new L.Draw.Polygon(this.map, this.drawControl.options.draw.polygon).enable();
  }

  initDrawing() {
    const drawControl = Object.assign(DRAW_CONTROL, {
      edit: {
        featureGroup: this.featureGroup,
        remove: true
      }
    });
    this.drawControl = new L.Control.Draw(drawControl);

    this.map.addControl(this.drawControl);
    this.enablePolygonDraw();

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

Map.propTypes = {
  onDrawComplete: PropTypes.func
};

export default Map;