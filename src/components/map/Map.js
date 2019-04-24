import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '../../constants/map';

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

  initMap = () => {
    this.map = L.map('map', {
      minZoom: MAP_CONFIG.minZoom,
      zoom: this.props.mapConfig.zoom,
      center: MAP_CONFIG.center,
      detectRetina: true,
      zoomControl: this.props.mapConfig.zoomControl || false,
      scrollWheelZoom: this.props.mapConfig.scrollWheelZoom || false
    });

    // SETTERS
    this.setZoomControl();
    this.setBasemap();

    this.props.map(this.map);
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
    this.borderLayer = L.tileLayer(MAP_CONFIG.borders, {})
                      .addTo(this.map)
                      .setZIndex(1);
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
