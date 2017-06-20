import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw'; // eslint-disable-line no-unused-vars
import { leafletSearch } from 'leaflet-search'; // eslint-disable-line no-unused-vars
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-search/dist/leaflet-search.min.css';
import { MAP_CONFIG, DRAW_CONTROL } from '../../constants/map';

class Map extends React.Component {

  componentDidMount() {
    this.initMap();
  }

  componentWillUnmount() {
    this.remove();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mapConfig.zoom !== nextProps.mapConfig.zoom) {
      this.map.setZoom(nextProps.mapConfig.zoom);
    }
  }

  initMap() {
    this.map = L.map('map', {
      minZoom: MAP_CONFIG.minZoom,
      zoom: this.props.mapConfig.zoom,
      center: MAP_CONFIG.center,
      detectRetina: true,
      zoomControl: isNaN(this.props.mapConfig.zoomControl) ? MAP_CONFIG.zoomControl : this.props.mapConfig.zoomControl,
      scrollWheelZoom: !!this.props.mapConfig.scrollWheelZoom
    });

    // SETTERS
    this.setAttribution();
    this.setZoomControl();
    this.setBasemap();
    this.setLayers();
    if (this.props.editable) {
      this.setDrawing();
      this.setDrawPolygon();
    }

    this.searchLayer = L.layerGroup().addTo(this.map);
    this.map.addControl(new L.Control.Search({
      layer: this.searchLayer,
      position: 'topright'
    }));
  }


  //SETTERS
  setAttribution() {
    this.map.attributionControl.addAttribution(MAP_CONFIG.attribution);
  }

  setZoomControl() {
    this.map.zoomControl && this.map.zoomControl.setPosition('topright');
  }

  setBasemap() {
    this.tileLayer = L.tileLayer(MAP_CONFIG.basemap, {})
                      .addTo(this.map)
                      .setZIndex(0);
  }

  setLayers() {
    this.featureGroup = new L.FeatureGroup();
    this.map.addLayer(this.featureGroup);
  }

  setDrawing() {
    const drawControl = Object.assign(DRAW_CONTROL, {
      edit: {
        featureGroup: this.featureGroup,
        remove: true
      }
    });
    this.drawControl = new L.Control.Draw(drawControl);

    this.map.addControl(this.drawControl);

    // DRAW LISTENERS
    this.map.on(L.Draw.Event.CREATED, (e) => {
      this.onDrawEventComplete(e);
    });

    this.map.on(L.Draw.Event.DELETED, (e) => {
      this.onDrawEventDelete(e);
    });
  }

  setDrawPolygon() {
    new L.Draw.Polygon(this.map, this.drawControl.options.draw.polygon).enable();
  }


  // MAP LISTENERS
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
      this.setDrawPolygon();
    }
  }


  // MAP FUNCTONS
  remove() {
    this.map.remove();
  }


  // RENDER
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
