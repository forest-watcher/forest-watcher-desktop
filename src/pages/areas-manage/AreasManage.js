import React from 'react';
import Hero from '../../components/layouts/Hero';
import { Input, Button, Form } from '../../components/form/Form';
import Map from '../../components/map/Map';
import { Link } from 'react-router-dom';
import { checkArea } from '../../helpers/areas';
import { toastr } from 'react-redux-toastr';
import LocateUser from '../../components/ui/LocateUser';
import ZoomControl from '../../components/ui/ZoomControl';
import DrawControl from '../../components/draw-control/DrawControlContainer';
import Attribution from '../../components/ui/Attribution';
import Loader from '../../components/ui/Loader';
import { FormattedMessage, injectIntl } from 'react-intl';
import CountrySearch from '../../components/country-search/CountrySearchContainer';
import LayersSelector from '../../components/layers-selector/LayersSelectorContainer';
import union from '@turf/union';
import { required } from '../../constants/validation-rules'
import withModal from '../../components/ui/withModal';
import ShapefileInfo from '../../components/ui/ShapefileInfo';
import Icon from '../../components/ui/Icon';

const ShapefileInfoModal = withModal(ShapefileInfo);
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
      },
      open: false,
      isValidatingShapefile: false
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
    if (this.props.saving && !nextProps.saving && !nextProps.error) {
      history.push('/areas');
      toastr.success(this.props.intl.formatMessage({ id: 'areas.saved' }));
    }
    if (nextProps.error) {
      toastr.success(this.props.intl.formatMessage({ id: 'areas.errorSaving' }));
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.form.geojson && this.form.name !== '') {
      this.props.setSaving(true);
      if (checkArea(this.form.geojson)) {
        const method = this.props.mode === 'manage' ? 'PATCH' : 'POST';
        this.props.saveAreaWithGeostore(this.form, this.state.map._container, method);
      } else {
        toastr.error(this.props.intl.formatMessage({ id: 'areas.tooLarge' }), this.props.intl.formatMessage({ id: 'areas.tooLargeDesc' }));
      }
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

  onShapefileChange = async (e) => {
    this.setState({ isValidatingShapefile: true });
    const shapeFile = e.target.files && e.target.files[0];
    const maxFileSize = 1000000 //1MB

    if (e.target.files[0].size <= maxFileSize) {
      const geojson = await this.props.getGeoFromShape(shapeFile);
      if (geojson && geojson.features) {
        const geojsonParsed = geojson.features.reduce(union);

        if (!checkArea(geojsonParsed)) {
          toastr.error(this.props.intl.formatMessage({ id: 'areas.uploadedTooLarge' }), this.props.intl.formatMessage({ id: 'areas.uploadedTooLargeDesc' }));
        } else {
          if (geojsonParsed) {
            this.onDrawComplete(geojsonParsed);
            const dotIndex = shapeFile.name.lastIndexOf('.') > -1
              ? shapeFile.name.lastIndexOf('.')
              : shapeFile.name.length;
            const areaName = shapeFile.name.substr(0, dotIndex);
            this.form.name = areaName;
            // Force render to notify the draw control of the external geojson
            this.forceUpdate();
          }
        }
      }
    } else {
      toastr.error(this.props.intl.formatMessage({ id: 'areas.fileTooLarge' }), this.props.intl.formatMessage({ id: 'areas.fileTooLargeDesc' }));
    }
    this.setState({ isValidatingShapefile: false });
  }

  onDrawComplete = (areaGeoJson) => {
    if (areaGeoJson) {
      if (!checkArea(areaGeoJson)) {
        toastr.error(this.props.intl.formatMessage({ id: 'areas.tooLarge' }), this.props.intl.formatMessage({ id: 'areas.tooLargeDesc' }));
      }
      this.form.geojson = areaGeoJson;
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

  onInfoClick = (e) => {
    e.preventDefault();
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <Hero
          title={this.props.mode === 'manage' ? "areas.manageArea" : "areas.createArea"}
        />
        <Loader isLoading={this.state.isValidatingShapefile} />
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
              <LayersSelector
                map={this.state.map}
              />
              <CountrySearch
                map={this.state.map}
                onZoomChange={ (zoom) => {
                  this.setState({
                    mapConfig: {
                      ...this.state.mapConfig,
                      zoom
                    }
                  });
                }}
              />
              <LocateUser
                map={this.state.map}
                setLoading={this.props.setLoading}
                onZoomChange={ (zoom) => {
                  this.setState({
                    mapConfig: {
                      ...this.state.mapConfig,
                      zoom
                    }
                  });
                }}
              />
              <ZoomControl
                map={this.state.map}
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
                mode={this.props.mode}
                onDrawComplete={this.onDrawComplete}
                onDrawDelete={this.onDrawDelete}
                geojson={this.form.geojson}
                saving={this.props.saving}
                onZoomChange={ (zoom) => {
                  this.setState({
                    mapConfig: {
                      ...this.state.mapConfig,
                      zoom
                    }
                  });
                }}
              />
              <Attribution />
            </div>
            <Loader isLoading={this.props.saving || this.props.loading} />
          </div>
          <div className="row columns">
            <div className="c-form -nav">
              <Link to="/areas">
                <button className="c-button -light" disabled={this.props.saving || this.props.loading}><FormattedMessage id="forms.cancel" /></button>
              </Link>
              <div className="horizontal-field">
                <label className="c-button -light" htmlFor="shapefile"><FormattedMessage id="areas.uploadShapefile" /></label>
                <input
                  type="file"
                  id="shapefile"
                  name="shapefile"
                  className="file-hidden"
                  accept=".zip"
                  onChange={this.onShapefileChange}
                  disabled={this.state.isValidatingShapefile}
                />
                <button className="info-button u-margin-left-small" onClick={this.onInfoClick}>
                  <Icon className="-small" name="icon-info"/>
                </button>
              </div>
              <div className="areas-inputs">
                <div className="horizontal-field">
                  <label className="text -x-small-title"><FormattedMessage id="areas.nameArea" />: </label>
                  <Input
                    type="text"
                    onChange={this.onInputChange}
                    name="name"
                    value={this.form.name}
                    placeholder={this.props.intl.formatMessage({ id: 'areas.nameAreaPlaceholder' })}
                    validations={[required]}
                    disabled={this.props.saving || this.props.loading}
                  />
                </div>
              </div>
              <Button className="c-button" disabled={this.props.saving || (!!this.props.editing) || this.props.loading}><FormattedMessage id="forms.save" /></Button>
            </div>
          </div>
        </Form>
        <ShapefileInfoModal
          open={this.state.open}
          close={this.closeModal}
          title={this.props.intl.formatMessage({ id: 'areas.shapefileInfoTitle'})}
          maxSize={this.props.intl.formatMessage({ id: 'areas.shapefileInfoMaxSize'})}
          formats={this.props.intl.formatMessage({ id: 'areas.shapefileInfoFormats'})}
          unzippedTitle={this.props.intl.formatMessage({ id: 'areas.shapefileInfoUnzippedTitle'})}
          unzipped={this.props.intl.formatMessage({ id: 'areas.shapefileInfoUnzipped'})}
          zippedTitle={this.props.intl.formatMessage({ id: 'areas.shapefileInfoUnzippedTitle'})}
          zipped={this.props.intl.formatMessage({ id: 'areas.shapefileInfoZipped'})}
          onAccept={this.closeModal}
        />
      </div>
    );
  }
}

export default injectIntl(AreasManage);
