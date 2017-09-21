import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import L from 'leaflet';


class LayersSelector extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      layerOption: null,
      mapLayer: null
    };
  }

  componentDidMount() {
    if (!this.props.layers.length) {
      this.props.getLayers();
    }
  }

  onChange = (selected) => {
    if (this.state.mapLayer) this.props.map.removeLayer(this.state.mapLayer);
    if (selected) {
      const { map, layers: { [selected.option]: layer }} = this.props;
      const mapLayer = L.tileLayer(layer.attributes.url).addTo(map);
      this.setState({ layerOption: selected, mapLayer });
    } else {
      this.setState({ layerOption: null, mapLayer: null });
    }
  };

  render() {
    const { layersOptions } = this.props;
    return (
      <div className="c-layers-selector">
        <Select
          name="layers-select"
          className="c-select -map"
          options={layersOptions}
          value={this.state.layerOption}
          onChange={this.onChange}
          placeholder={this.props.intl.formatMessage({ id: 'areas.layersPlaceholder' })}
          searchable={false}
          clearable={true}
          arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
        />
      </div>
    );
  }
}

LayersSelector.propTypes = {
  map: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  layersOptions: PropTypes.array.isRequired,
  getLayers: PropTypes.func.isRequired
};

export default injectIntl(LayersSelector);
