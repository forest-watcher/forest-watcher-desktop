import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import SwitchButton from 'react-switch-button';

class LayersSwitcher extends React.Component {
  toggleLayer = (layer) => {
    this.props.toggleLayer(layer, !layer.attributes.enabled);
  }


  render() {
    const { teamLayers, userLayers } = this.props;
    const renderLayers = (layers) => (
      layers.map((layer, i) => (
        <SwitchButton
          key={i}
          name={`${layer.attributes.owner.type}-layer-${i}-${layer.attributes.name}`} 
          labelRight={layer.attributes.name} 
          onChange={() => this.toggleLayer(layer)}
          defaultChecked={layer.attributes.enabled}
        />
      ))
    )

    return (
      <div className="c-layers-switcher">
        <h3><FormattedMessage id={"settings.selectedLayers"} /></h3>
        <div className="section layers-switchs">
          <h4><FormattedMessage id={"settings.teamLayers"} /></h4>
          {renderLayers(teamLayers)}
          <h4><FormattedMessage id={"settings.myLayers"} /></h4>
          {renderLayers(userLayers)}
        </div>
      </div> 
    );
  }
}

LayersSwitcher.propTypes = {
  userLayers: PropTypes.array.isRequired,
  teamLayers: PropTypes.array.isRequired
};

export default LayersSwitcher;
