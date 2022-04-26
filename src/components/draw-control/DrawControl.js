import React from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import { Draw, Control } from "leaflet-draw"; // eslint-disable-line no-unused-vars
import { DRAW_CONTROL, DRAW_CONTROL_DISABLED, POLYGON_STYLES, POLYGON_STYLES_ERROR } from "../../constants/map";
import { checkArea } from "../../helpers/areas";
import "leaflet-draw/dist/leaflet.draw.css";
import { injectIntl } from "react-intl";

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
    }
  }

  // SETTERS
  setLayers = () => {
    this.featureGroup = new L.FeatureGroup();
    this.map.addLayer(this.featureGroup);
  };

  setFeatures = () => {
    L.geoJson(this.props.geojson, {
      onEachFeature: (feature, layer) => {
        const geoJsonLayer = layer.toGeoJSON();
        if (!checkArea(geoJsonLayer)) {
          layer.setStyle(POLYGON_STYLES_ERROR);
        } else {
          layer.setStyle(POLYGON_STYLES);
        }
        this.featureGroup.removeLayer(this.featureGroup.getLayers()[0]);
        this.featureGroup.addLayer(layer);
        this.map.fitBounds(layer.getBounds());
        this.props.onZoomChange && this.props.onZoomChange(this.map.getBoundsZoom(layer.getBounds()));
      }
    });
  };

  setDrawing = () => {
    const DRAW_CONFIG = { ...DRAW_CONTROL };
    DRAW_CONFIG.draw.polygon.drawError.message = this.props.intl.formatMessage({ id: "areas.drawError" });
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

    if (this.props.mode === "manage") {
      this.drawControlDisabled.addTo(this.map);
    } else {
      this.drawControl.addTo(this.map);
    }

    // DRAW LISTENERS
    this.map.on(L.Draw.Event.CREATED, e => {
      this.onDrawEventComplete(e);
    });

    this.map.on(L.Draw.Event.EDITSTART, e => {
      this.setFeatures();
      this.props.setEditing(true);
    });

    this.map.on(L.Draw.Event.EDITED, e => {
      this.onDrawEventEdit(e);
    });

    this.map.on(L.Draw.Event.EDITSTOP, e => {
      this.props.setEditing(false);
    });

    this.map.on(L.Draw.Event.DELETESTART, e => {
      this.setFeatures();
      this.props.setEditing(true);
    });

    this.map.on(L.Draw.Event.DELETED, e => {
      this.onDrawEventDelete(e);
    });

    this.map.on(L.Draw.Event.DELETESTOP, e => {
      this.props.setEditing(false);
    });
  };

  enableDrawing = () => {
    this.map.removeControl(this.drawControlDisabled);
    this.drawControl.addTo(this.map);
  };

  disableDrawing = () => {
    this.map.removeControl(this.drawControl);
    this.drawControlDisabled.addTo(this.map);
  };

  // EVENT LISTENERS
  onDrawEventComplete = e => {
    const layer = e.layer;
    const geoJsonLayer = layer.toGeoJSON();
    if (!checkArea(geoJsonLayer)) {
      layer.setStyle(POLYGON_STYLES_ERROR);
    }
    this.featureGroup.addLayer(layer);
    this.props.onDrawComplete && this.props.onDrawComplete(geoJsonLayer);
    this.map.fitBounds(layer.getBounds());
    this.props.onZoomChange && this.props.onZoomChange(this.map.getBoundsZoom(layer.getBounds()));
    this.disableDrawing();
  };

  onDrawEventEdit = e => {
    const layers = e.layers;
    layers.eachLayer(layer => {
      const geoJsonLayer = layer.toGeoJSON();
      this.featureGroup.addLayer(layer);
      this.props.onDrawComplete && this.props.onDrawComplete(geoJsonLayer);
      // this.map.fitBounds(layer.getBounds());
    });
  };

  onDrawEventDelete = e => {
    const layer = e.layer;
    this.featureGroup.removeLayer(layer);
    this.props.onDrawComplete && this.props.onDrawDelete();
    if (this.featureGroup.getLayers().length === 0) {
      this.enableDrawing();
    }
  };

  render() {
    return null;
  }
}

DrawControl.propTypes = {
  map: PropTypes.object,
  geojson: PropTypes.object
};

export default injectIntl(DrawControl);
