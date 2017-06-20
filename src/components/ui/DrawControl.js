import React from 'react';
import L from 'leaflet';
import { Draw, Control } from 'leaflet-draw'; // eslint-disable-line no-unused-vars
import { DRAW_CONTROL } from '../../constants/map';
import 'leaflet-draw/dist/leaflet.draw.css';

class DrawControl extends React.Component {

  constructor(props) {
    super(props);

    // Bindings
    this.setLayers = this.setLayers.bind(this);
    this.setDrawing = this.setDrawing.bind(this);
    this.setDrawPolygon = this.setDrawPolygon.bind(this);
  }

  /* Component lifecycle */
  componentWillReceiveProps(nextProps) {
    if (this.map !== nextProps.map) {
      this.map = nextProps.map;
      this.setLayers();
      this.setDrawing();
      this.setDrawPolygon();
    }
  }

  // SETTERS
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


  // EVENT LISTENERS
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

  render() {
    return null;
  }
}

DrawControl.propTypes = {
  map: React.PropTypes.object
};

export default DrawControl;
