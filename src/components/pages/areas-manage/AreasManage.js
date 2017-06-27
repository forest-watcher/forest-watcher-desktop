import React from 'react';
import Hero from '../../layouts/Hero';
import { Input, Button, Form } from '../../form/Form';
import Map from '../../map/Map';
import { Link } from 'react-router-dom';
import { validation } from '../../../helpers/validation'; // eslint-disable-line no-unused-vars
import { toastr } from 'react-redux-toastr';
import Icon from '../../ui/Icon';
import ZoomControl from '../../ui/ZoomControl';
import DrawControl from '../../draw-control/DrawControlContainer';
import Attribution from '../../ui/Attribution';
import Loader from '../../ui/Loader';
import { AREAS } from '../../../constants/map';

const geojsonArea = require('@mapbox/geojson-area');

class AreasManage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {
      id: props.area ? props.area.id : null,
      name: props.area ? props.area.attributes.name : '',
      geojson: props.geojson || null
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
    const { history } = this.props;
    if (!this.props.saving) {
      this.form = {
        ...this.form,
        id: nextProps.area ? nextProps.area.id : null,
        name: nextProps.area ? nextProps.area.attributes.name : '',
        geojson: nextProps.geojson ? nextProps.geojson : null
      };
    }
    if (this.props.saving === true && nextProps.saving === false) {
      history.push('/areas');
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.form.geojson && this.form.name !== '') {
      const method = this.props.mode === 'manage' ? 'PATCH' : 'POST';
      this.props.setSaving(true);
      this.props.saveAreaWithGeostore(this.form, this.state.map._container, method);
    } else {
      toastr.error('Missing values', 'Please provide an area and a name');
    }
  }

  onInputChange = (e) => {
    this.form = {
      ...this.form,
      name: e.target.value
    };
  }

  onDrawComplete = (areaGeoJson) => {
    if (areaGeoJson) {
      const area = geojsonArea.geometry(areaGeoJson.geometry);
      if (area <= AREAS.maxSize) {
        this.form = {
          ...this.form,
          geojson: areaGeoJson
        };
      } else {
        toastr.error('Area too large', 'Please draw a smaller area');
      }
    }
  }

  onDrawDelete = () => {
    if (this.form.geojson) {
      this.form = {
        ...this.form,
        geojson: null
      };
    }
  }

  render() {
    return (
      <div>
        <Hero
          title={this.props.mode === 'manage' ? "Manage Area of Interest" : "Create an Area of Interest"}
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
                saving={this.props.saving}
              />
              <Attribution />
            </div>
            { this.props.saving &&
              <Loader />
            }
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
              <Button className="c-button" disabled={this.props.saving || this.props.editing ? true : false}>Save</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default AreasManage;
