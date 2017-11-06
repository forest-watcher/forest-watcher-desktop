import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../ui/Icon';
import { FormattedMessage } from 'react-intl';
import Switch from 'react-toggle-switch';


class LayersSwitcher extends React.Component {
  toggleLayer = (layer) => {
    this.props.toggleLayer(layer, !layer.attributes.enabled);
  }

  getLayerName(name) {
    if (name.match(/^layers\./) !== null) {
      return (<FormattedMessage id={name}/>)
    }
    return name;
  }

  render() {
    const { publicLayers, teamLayers, userLayers, deleteLayer, isManager } = this.props;

    const switchRow = (layer, i) => (
      <div className="list-row">
        <div className="layer-name">
          <Switch
            className="c-switcher"
            onClick={() => this.toggleLayer(layer)}
            on={layer.attributes.enabled}
            enabled={true}
          />
          <label>{this.getLayerName(layer.attributes.name)}</label>
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
                    <div> {this.getLayerName(layer.attributes.name)} </div>
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
          <h3><FormattedMessage id={"settings.selectedLayers"} /></h3>
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
  publicLayers: PropTypes.array.isRequired,
  isManager: PropTypes.bool.isRequired,
  deleteLayer: PropTypes.func.isRequired
};

export default LayersSwitcher;
