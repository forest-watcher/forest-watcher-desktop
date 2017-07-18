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
    
    const switchRow = (layer, i) => (
      <div className="list-row">
        <div className="layer-name">
          <SwitchButton
            name={`${layer.attributes.owner.type}-layer-${i}-${layer.id}`} 
            labelRight={layer.attributes.name} 
            onChange={() => this.toggleLayer(layer)}
            defaultChecked={layer.attributes.enabled}
          />
        </div>
        <button className={"delete-button"} type="button" onClick={() => deleteLayer(layer)}>
          <Icon name="icon-delete" className="-small " />
        </button>
      </div>
    );

    const renderLayers = (layerType, layers) => (
      <div className={`${layerType}-layers`}>
        <div className="layers-title">
          <FormattedMessage id={`settings.${layerType}Layers`} />
        </div>
        { layers.map((layer, i) => (
          <div className="switch-row" key={`${layer.attributes.owner.type}-layer-${i}-${layer.id}`}>
            { ((layer.attributes.owner.type === "USER" && layerType !== 'public') ||
              (layer.attributes.owner.type === "TEAM" && isManager)) ?
                switchRow(layer, i)
              :
                <div className="list-row">
                  <div className="layer-name">
                    <div> {layer.attributes.name} </div>
                  </div>
                </div>
            }
          </div>
          ))
        }
      </div>
    )

    return (
      <div className="c-layers-show">
        <div className="list-header">
          <FormattedMessage id={"settings.selectedLayers"} />
        </div>
        <div className="layers-switchs">
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
