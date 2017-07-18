import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../ui/Icon';
import { FormattedMessage } from 'react-intl';
import SwitchButton from 'react-switch-button';

class LayersSwitcher extends React.Component {
  toggleLayer = (layer) => {
    this.props.toggleLayer(layer, !layer.attributes.enabled);
  }
  render() {
    const { publicLayers, teamLayers, userLayers, deleteLayer, isManager } = this.props;
    const renderLayers = (layerType, layers) => (
      <div className={`${layerType}-layers`}>
        <h4><FormattedMessage id={`settings.${layerType}Layers`} /></h4>
        { layers.map((layer, i) => (
          <div className="layer-switch" key={`${layer.attributes.owner.type}-layer-${i}-${layer.id}`}>
            <SwitchButton
              name={`${layer.attributes.owner.type}-layer-${i}-${layer.attributes.id}`} 
              labelRight={layer.attributes.name} 
              onChange={() => this.toggleLayer(layer)}
              defaultChecked={layer.attributes.enabled}
            />
            <button className={"delete-button"} type="button" onClick={() => deleteLayer(layer)}>
              <Icon name="icon-delete" className="-small " />
            </button>
          </div>
          ))
        }
      </div>
    )

    return (
      <div className="c-layers-switcher">
        <h3><FormattedMessage id={"settings.selectedLayers"} /></h3>
        <div className="section layers-switchs">
          { isManager && renderLayers('public', publicLayers) }
          { renderLayers('team', teamLayers) }
          { renderLayers('user', userLayers) }
        </div>
      </div> 
    );
  }
}

LayersSwitcher.propTypes = {
  userLayers: PropTypes.array.isRequired,
  teamLayers: PropTypes.array.isRequired,
  publicLayers: PropTypes.array.isRequired
};

export default LayersSwitcher;
