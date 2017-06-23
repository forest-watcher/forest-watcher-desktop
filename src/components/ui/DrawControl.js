import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw'; // eslint-disable-line no-unused-vars
import { DRAW_CONTROL, DRAW_CONTROL_DISABLED } from '../../constants/map';
import 'leaflet-draw/dist/leaflet.draw.css';

class DrawControl extends React.Component {

  constructor(props) {
    super(props);

    // Bindings
    this.setLayers = this.setLayers.bind(this);
    this.setDrawing = this.setDrawing.bind(this);
    this.enableDrawing = this.enableDrawing.bind(this);
    this.disableDrawing = this.disableDrawing.bind(this);
  }

  /* Component lifecycle */

  componentWillReceiveProps(nextProps) {
    if (this.props.map !== nextProps.map) {
      this.map = nextProps.map;
      this.setLayers();
      this.setDrawing();
    }
  }

  // SETTERS
  setLayers() {
    this.featureGroup = new L.FeatureGroup();
    if (this.props.geojson) {
      L.geoJson(this.props.geojson, {
        onEachFeature: (feature, layer) => {
          this.featureGroup.addLayer(layer);
          this.map.fitBounds(layer.getBounds());
        }
      });
    }
    this.map.addLayer(this.featureGroup);
  }

  setDrawing() {
    const drawControl = Object.assign(DRAW_CONTROL, {
      edit: {
        featureGroup: this.featureGroup,
        remove: true
      }
    });
    const drawControlDisabled = Object.assign(DRAW_CONTROL_DISABLED, {
      edit: {
        featureGroup: this.featureGroup,
        remove: true
      }
    });
    this.drawControl = new L.Control.Draw(drawControl);
    this.drawControlDisabled = new L.Control.Draw(drawControlDisabled);

    if (this.props.geojson) {
      this.map.addControl(this.drawControlDisabled);
    } else {
      this.map.addControl(this.drawControl);
    }

    // DRAW LISTENERS
    this.map.on(L.Draw.Event.CREATED, (e) => {
      this.onDrawEventComplete(e);
    });

    this.map.on(L.Draw.Event.EDITED, (e) => {
      this.onDrawEventEdit(e);
    });

    this.map.on(L.Draw.Event.DELETED, (e) => {
      this.onDrawEventDelete(e);
    });
  }

  enableDrawing() {
    this.map.removeControl(this.drawControlDisabled);
    this.map.addControl(this.drawControl);
  }

  disableDrawing() {
    this.map.removeControl(this.drawControl);
    this.map.addControl(this.drawControlDisabled);
  }


  // EVENT LISTENERS
  onDrawEventComplete(e) {
    const layer = e.layer;
    const geoJsonLayer = layer.toGeoJSON();
    this.featureGroup.addLayer(layer);
    this.props.onDrawComplete && this.props.onDrawComplete(geoJsonLayer);
    this.disableDrawing();
    this.map.fitBounds(layer.getBounds());
  }

  onDrawEventEdit(e) {
    const layers = e.layers;
    layers.eachLayer(layer => {
      const geoJsonLayer = layer.toGeoJSON();
      this.featureGroup.addLayer(layer);
      this.props.onDrawComplete && this.props.onDrawComplete(geoJsonLayer);
    });
    this.disableDrawing();
  }

  onDrawEventDelete(e) {
    const layer = e.layer;
    this.featureGroup.removeLayer(layer);
    this.props.onDrawComplete && this.props.onDrawDelete();
    if (this.featureGroup.getLayers().length === 0) {
      this.enableDrawing();
    }
  }

  render() {
    return null;
  }
}

DrawControl.propTypes = {
  map: PropTypes.object,
  geojson: PropTypes.object
};

export default DrawControl;