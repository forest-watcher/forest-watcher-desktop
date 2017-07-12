import React from 'react';

import { FormattedMessage } from 'react-intl';
import Map from '../../map/Map';
import { includes, diff } from '../../../helpers/utils';
import Card from '../../ui/Card';
import Tab from '../../ui/Tab';
import SwitchButton from 'react-switch-button';

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
      tabIndex: 0
    }
  }
  
  componentWillMount(){
    this.props.getLayers();
  }

  handleTabIndexChange = (tabIndex) => {
    this.setState({ tabIndex });
  }

  toggleLayer = (layerUrl) => {
    let layers = [].concat(this.state.mapConfig.layers);
    if(!includes(layers, layerUrl)){
      layers = layers.concat(layerUrl);

    } else {
      layers = diff(layers, [layerUrl])
    }
    // UpdateLayers in API
    this.setState({
      mapConfig: {
        ...this.state.mapConfig,
        layers
      }
    });
  }

  render() {
    return (
      <div >
        <div className="row">
          <div className="small-6 columns">
            <div className="section">
              <div className="title"><FormattedMessage id={"settings.contextualLayers"} /></div>
              <Tab 
                options={["settings.gfwLayers", "settings.customLayers"]}
                selectedIndex={this.state.tabIndex}
                handleTabIndexChange={this.handleTabIndexChange}
              />
            </div>
            <div className="section">
              <Card className={"-big"}>
                {this.state.tabIndex === 0 ? 
                  (this.props.gfwLayers && this.props.gfwLayers.map((layer, i) => 
                    <div key={i}>
                      <SwitchButton name={`${i}${layer.title}`} labelRight={layer.title} onChange={() => this.toggleLayer(layer.tileurl)} />
                    </div>
                  ))
                  : null
                  }
               </Card> 
            </div>
          </div>
          <div className="small-6 columns">
            <div className="c-map -layers-container">
              <Map
                mapConfig={this.state.mapConfig}
                map={(map) => {
                  this.setState({map});
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LayersManager;
