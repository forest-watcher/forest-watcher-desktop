import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../ui/Icon';
import { FormattedMessage } from 'react-intl';

class LayersShow extends React.Component {
  render() {
    const { publicLayers, teamLayers, userLayers, isManager } = this.props;
    const renderLayers = (layerType, layers) => (
      <div className="layers-title">
        <FormattedMessage id={`settings.${layerType}Layers`} />
        { layers.map((layer, i) => (
          <div key={i} className="list-row">
            <div className="layer-name">{ layer.attributes.name }</div>
            { layer.attributes.enabled && <Icon className="-small -green" name="icon-checkmark"/> }
          </div>
          ))
        }
      </div>
    )

    return (
      <div className="c-layers-show">
        <div className="row">
          <div className="small-6 columns">
            <div className="list-row">
              <FormattedMessage id={"settings.selectedLayers"} />
              <FormattedMessage id={"settings.enabled"} />
            </div>
            <div className="section">
              { isManager && renderLayers('public', publicLayers) }
              { renderLayers('team', teamLayers) }
              { renderLayers('user', userLayers) }
            </div>
          </div>
        </div>
      </div> 
    );
  }
}

LayersShow.propTypes = {
  userLayers: PropTypes.array.isRequired,
  teamLayers: PropTypes.array.isRequired,
  publicLayers: PropTypes.array.isRequired
};

export default LayersShow;
