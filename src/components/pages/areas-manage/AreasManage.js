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
      name: props.area ? props.area.attributes.name : '',
      geojson: props.geojson || null
    };
    this.state = {
      mapConfig: {
        zoom: 10,
        lat: 0,
        lng: 0,
        zoomControl: false,
        scrollWheelZoom: false
      }
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onDrawComplete = this.onDrawComplete.bind(this);
    this.onDrawDelete = this.onDrawDelete.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.form.geojson) {
      toastr.success('Area saved', 'Note: in dev mode, geojson not saved to API');
      this.props.saveAreaWithGeostore(this.form, this.map._container);
    } else {
      toastr.error('Area needed', 'You cannot save without drawing an geojson');
    }
  }

  onInputChange(e) {
    this.form[e.target.name] = e.target.value;
  }

  onDrawComplete(areaGeoJson) {
    if (areaGeoJson) {
      const area = geojsonArea.geometry(areaGeoJson.geometry);
      if (area <= AREAS.maxSize) {
        this.form.geojson = areaGeoJson;
      } else {
        toastr.error('Area too large', 'Please draw a smaller area');
      }
    }
  }

  onDrawDelete() {
    if (this.form.geojson) {
      this.form.geojson = null;
    }
  }

  render() {
    return (
      <div>
        <Hero
          title="Create an Area of Interest"
        />
        <Form onSubmit={this.onSubmit}>
          <div className="l-map">
            <Map
              editable={true}
              mapConfig={this.state.mapConfig}
              ref={(component) => {this.map = component && component.map;}}
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
                map={this.map}
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
                    onChange={this.onInputChange}
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
