import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw'; // eslint-disable-line no-unused-vars
import { DRAW_CONTROL, DRAW_CONTROL_DISABLED, POLYGON_STYLES } from '../../constants/map';
import 'leaflet-draw/dist/leaflet.draw.css';
import { injectIntl } from 'react-intl';

class DrawControl extends React.Component {

  /* Component lifecycle */
  componentWillReceiveProps(nextProps) {
    if (this.props.map !== nextProps.map) {
      this.map = nextProps.map;
      this.setLayers();
      this.setDrawing();
      if (this.props.geojson) {
        this.setFeatures();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.geojson !== prevProps.geojson) {
      this.setFeatures();
      this.disableDrawing();
    }
  }

  // SETTERS
  setLayers = () => {
    this.featureGroup = new L.FeatureGroup();
    this.map.addLayer(this.featureGroup);
  }

  setFeatures = () => {
    L.geoJson(this.props.geojson, {
      onEachFeature: (feature, layer) => {
        layer.setStyle(POLYGON_STYLES);
        this.featureGroup.removeLayer(this.featureGroup.getLayers()[0]);
        this.featureGroup.addLayer(layer);
        this.map.fitBounds(layer.getBounds());
      }
    });
  }

  setDrawing = () => {
    const DRAW_CONFIG = {...DRAW_CONTROL};
    DRAW_CONFIG.draw.polygon.drawError.message = this.props.intl.formatMessage({ id: 'areas.drawError' });
    const drawControl = Object.assign(DRAW_CONFIG, {
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

    this.map.on(L.Draw.Event.EDITSTART, (e) => {
      this.props.setEditing(true);
    });

    this.map.on(L.Draw.Event.EDITED, (e) => {
      this.props.setEditing(false);
      this.onDrawEventEdit(e);
    });

    this.map.on(L.Draw.Event.EDITSTOP, (e) => {
      this.props.setEditing(false);
    });

    this.map.on(L.Draw.Event.DELETESTART, (e) => {
      this.props.setEditing(true);
    });

    this.map.on(L.Draw.Event.DELETED, (e) => {
      this.props.setEditing(false);
      this.onDrawEventDelete(e);
    });
  }

  enableDrawing = () => {
    this.map.removeControl(this.drawControlDisabled);
    this.map.addControl(this.drawControl);
  }

  disableDrawing = () => {
    this.map.removeControl(this.drawControl);
    this.map.addControl(this.drawControlDisabled);
  }


  // EVENT LISTENERS
  onDrawEventComplete = (e) => {
    const layer = e.layer;
    const geoJsonLayer = layer.toGeoJSON();
    this.featureGroup.addLayer(layer);
    this.props.onDrawComplete && this.props.onDrawComplete(geoJsonLayer);
    this.disableDrawing();
    this.map.fitBounds(layer.getBounds());
  }

  onDrawEventEdit = (e) => {
    const layers = e.layers;
    layers.eachLayer(layer => {
      const geoJsonLayer = layer.toGeoJSON();
      this.featureGroup.addLayer(layer);
      this.props.onDrawComplete && this.props.onDrawComplete(geoJsonLayer);
      this.map.fitBounds(layer.getBounds());
    });
    this.disableDrawing();
  }

  onDrawEventDelete = (e) => {
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

export default injectIntl(DrawControl);
