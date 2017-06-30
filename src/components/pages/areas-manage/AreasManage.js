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
import { FormattedMessage, injectIntl } from 'react-intl';

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
        zoom: 3,
        lat: 0,
        lng: 0,
        zoomControl: false,
        scrollWheelZoom: false
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { history } = this.props;
    if (!nextProps.editing && !this.props.editing && !nextProps.saving && !this.props.saving) {
      this.form = {
        ...this.form,
        id: nextProps.area ? nextProps.area.id : null,
        name: nextProps.area ? nextProps.area.attributes.name : '',
        geojson: nextProps.geojson ? nextProps.geojson : null
      };
    }
    if (this.props.saving && !nextProps.saving) {
      history.push('/areas');
      toastr.success(this.props.intl.formatMessage({ id: 'areas.saved' }));
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.form.geojson && this.form.name !== '') {
      const method = this.props.mode === 'manage' ? 'PATCH' : 'POST';
      this.props.setSaving(true);
      this.props.saveAreaWithGeostore(this.form, this.state.map._container, method);
    } else {
      toastr.error(this.props.intl.formatMessage({ id: 'areas.missingValues' }), this.props.intl.formatMessage({ id: 'areas.missingValuesDesc' }));
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
        this.form.geojson = areaGeoJson;
      } else {
        toastr.error(this.props.intl.formatMessage({ id: 'areas.tooLarge' }), this.props.intl.formatMessage({ id: 'areas.tooLargeDesc' }));
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
          title={this.props.mode === 'manage' ? "areas.manageArea" : "areas.createArea"}
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
                maxZoom={20}
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
            <Loader isLoading={this.props.saving} />
          </div>
          <div className="row columns">
            <div className="c-form -nav">
              <Link to="/areas">
                <button className="c-button -light" disabled={this.props.saving}><FormattedMessage id="forms.cancel" /></button>
              </Link>
              <div className="areas-inputs">
                <div className="upload-field">
                  <span className="text -x-small-title"><FormattedMessage id="areas.upload" /></span>
                  <Icon name="icon-download" className="-big -transparent -stroke-green" />
                </div>
                <span className="separator -vertical"></span>
                <div className="horizontal-field">
                  <label className="text -x-small-title"><FormattedMessage id="areas.nameArea" />: </label>
                  <Input
                    type="text"
                    onChange={this.onInputChange}
                    name="name"
                    value={this.form.name}
                    placeholder={this.props.intl.formatMessage({ id: 'areas.nameAreaPlaceholder' })}
                    validations={['required']}
                    disabled={this.props.saving}
                    />
                </div>
              </div>
              <Button className="c-button" disabled={this.props.saving || this.props.editing ? true : false}><FormattedMessage id="forms.save" /></Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default injectIntl(AreasManage);
