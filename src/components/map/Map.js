import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '../../constants/map';
import { equals, includes } from '../../helpers/utils';

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
    if (!equals(this.props.mapConfig.layers, nextProps.mapConfig.layers)) {
      this.updateLayers(nextProps.mapConfig.layers);
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
  }

  updateLayers(layerUrls) {
    layerUrls.forEach((layerUrl) => {
      const layer = L.tileLayer(layerUrl, { maxZoom:19 });
      if (!this.map.hasLayer(layer)) layer.addTo(this.map).setZIndex(0);
    });
    this.map.eachLayer((layer) => {
      if (layer._url !== MAP_CONFIG.basemap && !includes(layerUrls, layer._url)){
        this.map.removeLayer(layer);
      }  
    })
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
