import React from 'react';

import { FormattedMessage } from 'react-intl';
import SwitchButton from 'react-switch-button';

class LayersSwitcher extends React.Component {
  toggleLayer = (layer) => {
    this.props.toggleLayer(layer, !layer.attributes.enabled);
  }

  render() {
    return (
      <div>
        <h3><FormattedMessage id={"settings.selectedLayers"} /></h3>
        <div className="section">
          {this.props.selectedLayers.map((selectedLayer, i) => (
            <div key={i}>
              <SwitchButton 
                name={`${i}${selectedLayer.attributes.name}`} 
                labelRight={selectedLayer.attributes.name} 
                onChange={() => this.toggleLayer(selectedLayer)}
                defaultChecked={selectedLayer.attributes.enabled}
              />
              {selectedLayer.attributes.owner.type === 'TEAM' && 
              <span className="team-flag"><FormattedMessage id={"settings.team"} /></span>
              }
            </div>
          ))}
        </div>
      </div> 
    );
  }
}

export default LayersSwitcher;
