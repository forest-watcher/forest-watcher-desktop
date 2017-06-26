import React from 'react';
import Hero from '../../layouts/Hero';
import { Input, Button, Form } from '../../form/Form';
import Map from '../../map/Map';
import { Link } from 'react-router-dom';
import { validation } from '../../../helpers/validation'; // eslint-disable-line no-unused-vars
import { toastr } from 'react-redux-toastr';
import Icon from '../../ui/Icon';
import ZoomControl from '../../ui/ZoomControl';
import DrawControl from '../../ui/DrawControl';
import { AREAS } from '../../../constants/map';

const geojsonArea = require('@mapbox/geojson-area');

class AreasManage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {
      id: props.area.id || null,
      name: props.area ? props.area.attributes.name : '',
      geojson: props.geojson || null,
      geostore: props.geostore || null
    };
    this.state = {
      map: {},
      mapConfig: {
        zoom: 10,
        lat: 0,
        lng: 0,
        zoomControl: false,
        scrollWheelZoom: false
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.form = {
      ...this.form,
      area: nextProps.area ? nextProps.area.attributes.name : '',
      geojson: nextProps.geojson ? nextProps.geojson : ''
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.form.geojson) {
      if (this.props.editing) {
        this.props.updateAreaWithGeostore(this.form, this.state.map._container);
      } else {
        this.props.saveAreaWithGeostore(this.form, this.state.map._container);
      }
    } else {
      toastr.error('Area needed', 'You cannot save without drawing an geojson');
    }
  }

  onInputChange(e) {
    debugger;
    this.form.name = e.target.value;
  }

  onDrawComplete = (areaGeoJson) => {
    if (areaGeoJson) {
      const area = geojsonArea.geometry(areaGeoJson.geometry);
      if (area <= AREAS.maxSize) {
        this.form.geojson = areaGeoJson;
      } else {
        toastr.error('Area too large', 'Please draw a smaller area');
      }
    }
  }

  onDrawDelete = () => {
    if (this.form.geojson) {
      this.form.geojson = null;
    }
  }

  render() {
    return (
      <div>
        <Hero
          title={this.props.editing ? "Manage Area of Interest" : "Create an Area of Interest"}
        />
        <Form onSubmit={this.onSubmit}>
          <div className="l-map">
            <Map
              editable={true}
              mapConfig={this.state.mapConfig}
              map={(map) => {
                this.setState({map});
              }}
            />
            <div className="c-map-controls">
              <ZoomControl
                zoom={this.state.mapConfig.zoom}
                minZoom={3}
                maxZoom={13}
                onZoomChange={ (zoom) => {
                  this.setState({
                    mapConfig: {
                      ...this.state.mapConfig,
                      zoom
                    }
                  });
                }}
              />
            <DrawControl
              map={this.state.map}
              onDrawComplete={this.onDrawComplete}
              onDrawDelete={this.onDrawDelete}
              geojson={this.form.geojson}
            />
            </div>
          </div>
          <div className="row columns">
            <div className="c-form -nav">
              <Link to="/areas">
                <button className="c-button -light">Cancel</button>
              </Link>
              <div className="areas-inputs">
                <div className="upload-field">
                  <span className="text -x-small-title">Upload an Area</span>
                  <Icon name="icon-download" className="-big -transparent -stroke-green" />
                </div>
                <span className="separator -vertical"></span>
                <div className="horizontal-field">
                  <label className="text -x-small-title">Name the Area: </label>
                  <Input
                    type="text"
                    onChange={ (e) => { this.form.name = e.target.value } }
                    name="name"
                    value={this.form.name}
                    placeholder="type your title"
                    validations={['required']}
                    />
                </div>
              </div>
              <Button className="c-button">Save</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default AreasManage;
