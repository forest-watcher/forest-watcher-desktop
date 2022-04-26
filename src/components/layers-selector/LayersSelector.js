import React from "react";
import PropTypes from "prop-types";
import { injectIntl, FormattedMessage } from "react-intl";
import Select from "react-select";
import L from "leaflet";
import DropdownIndicator from "../../components/ui/SelectDropdownIndicator";

class LayersSelector extends React.Component {
  constructor(props) {
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

  getLayerName(name) {
    if (name.match(/^layers\./) !== null) {
      return <FormattedMessage id={name} />;
    }
    return name;
  }

  onChange = selected => {
    if (this.state.mapLayer) {
      this.props.map.removeLayer(this.state.mapLayer);
    }
    if (selected) {
      const {
        map,
        layers: { [selected.value]: layer }
      } = this.props;
      const mapLayer = L.tileLayer(layer.attributes.url).addTo(map);
      this.setState({ layerOption: selected, mapLayer });
    } else {
      this.setState({ layerOption: null, mapLayer: null });
    }
  };

  render() {
    const { layersOptions, intl } = this.props;
    const options = layersOptions.map(option => ({ value: option.option, label: this.getLayerName(option.label) }));
    return (
      <div className="c-layers-selector u-margin-bottom-tiny">
        <Select
          name="layers-select"
          className="c-select -map u-w-100"
          classNamePrefix="Select"
          options={options}
          value={this.state.layerOption}
          onChange={this.onChange}
          placeholder={intl.formatMessage({ id: "areas.layersPlaceholder" })}
          isSearchable={false}
          isClearable={true}
          components={{ DropdownIndicator }}
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
