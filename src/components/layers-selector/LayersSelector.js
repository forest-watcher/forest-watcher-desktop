import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import L from 'leaflet';


class LayersSelector extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      layer: null
    };
  }

  componentDidMount() {
    if (!this.props.layers.length) {
      this.props.getLayers();
    }
  }

  onChange = (selected) => {
    this.setState({ layer: selected })
  };

  render() {
    const { layersOptions } = this.props;
    return (
      <div className="c-layers-selector">
        <Select
          name="layers-select"
          className="c-select -map"
          options={layersOptions}
          value={this.state.layer}
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
  map: PropTypes.object,
  layers: PropTypes.array,
  layersOptions: PropTypes.array,
  getLayers: PropTypes.func
};

export default injectIntl(LayersSelector);
