import { Component } from "react";
import PropTypes from "prop-types";

import { FormattedMessage } from "react-intl";
import Icon from "../ui/Icon";

class LayersShow extends Component {
  getLayerName(name) {
    if (name.match(/^layers\./) !== null) {
      return <FormattedMessage id={name} />;
    }
    return name;
  }

  render() {
    const { publicLayers, teamLayers, userLayers, isManager } = this.props;
    const renderLayers = (layerType, layers) => (
      <div className="layers-type">
        <div className="layers-title">
          <FormattedMessage id={`settings.${layerType}Layers`} />
        </div>
        {layers.map((layer, i) => (
          <div key={i} className="list-row">
            <div className="layer-name">{this.getLayerName(layer.attributes.name)}</div>
            {layer.attributes.enabled && <Icon className="-small -green" name="icon-checkmark" />}
          </div>
        ))}
      </div>
    );

    return (
      <div className="c-layers-show">
        <div className="row">
          <div className="small-12 medium-6 columns">
            <div className="list-row list-header">
              <h3>
                <FormattedMessage id={"settings.selectedLayers"} />
              </h3>
              <FormattedMessage id={"settings.enabled"} />
            </div>
            <div className="layers-list">
              {isManager && renderLayers("public", publicLayers)}
              {renderLayers("team", teamLayers)}
              {renderLayers("user", userLayers)}
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
