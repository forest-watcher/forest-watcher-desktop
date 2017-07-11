import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import Map from '../../map/Map';
import { includes } from '../../../helpers/utils';

class LayersManager extends React.Component {
  constructor() {
    super();
    this.state = {
      map: {},
      mapConfig: {
        zoom: 3,
        lat: 0,
        lng: 0,
        zoomControl: false,
        scrollWheelZoom: false,
        layers: []
      },
      selectedLayers: []
    }
  }
  
  componentWillMount(){
    this.props.getLayers();
  }

  addLayer = (layer) => {
    const layerUrl = layer.tileurl;
    let layers = [].concat(this.state.mapConfig.layers);
    if(!includes(layers, layerUrl)){
      layers = layers.concat(layerUrl);
    }
    this.setState({
      mapConfig: {
        ...this.state.mapConfig,
        layers
      },
      selectedLayers: this.state.selectedLayers.concat(layer)
    });
  }

  render() {
    return (
      <div >
        <div className="row">
          <div className="small-6 columns">
            <div className="section">
              <div className="title"><FormattedMessage id={"settings.contextualLayers"} /></div>
              <div className="title"><FormattedMessage id={"settings.gfwLayers"} /></div>
            </div>
            <div className="section">
                { this.props.gfwLayers && this.props.gfwLayers.map((layer, i) => 
                    <div key={i}>
                      <a onClick={() => this.addLayer(layer)}> {layer.title} </a>
                    </div>
                  )
                }
              <button className="c-button" onClick={this.addLayer}>Add Layer</button>
            </div>
          </div>
          <div className="small-6 columns">
            <div className="section">
              <div className="title"><FormattedMessage id={"settings.selectedLayers"} /></div>
            </div>
            <div className="section">
                { this.state.selectedLayers.map((layer, i) => 
                    <div key={i}>{layer.title}</div>
                  )
                }
            </div>
          </div>
        </div>
        <div className="c-map -layers-container row column">
          <Map
            mapConfig={this.state.mapConfig}
            map={(map) => {
              this.setState({map});
            }}
          />
        </div>
      </div>
    );
  }
}

LayersManager.propTypes = {
};

export default LayersManager;
