import React from 'react';

import { FormattedMessage } from 'react-intl';
import Map from '../../map/Map';
import { includes } from '../../../helpers/utils';
import Card from '../../ui/Card';
import Tab from '../../ui/Tab';
import SwitchButton from 'react-switch-button';
import Checkbox from '../../ui/Checkbox';

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
    this.props.getGFWLayers();
    this.props.getLayers();
  }

  handleTabIndexChange = (tabIndex) => {
    this.setState({ tabIndex });
  }

  addLayer = (layer) => {
    const layerUrl = layer.tileurl;
    let layerUrls = this.props.selectedLayers.map((l) => l.url);
    if(!includes(layerUrls, layerUrl)){
      layerUrls = layerUrls.concat(layerUrl);
    }
    this.props.createLayer(layer, null);
  }

  toggleLayer = (layer) => {
    this.props.toggleLayer(layer, !layer.attributes.enabled);
  }

  render() {
    return (
      <div className="c-layers-manager">
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
            <Card className={"-big"}>
              {this.state.tabIndex === 0 ? 
                (this.props.gfwLayers && this.props.gfwLayers.map((layer, i) => 
                  <div key={i}>
                  <Checkbox 
                    id={`${i}${layer.title}`} 
                    label={ layer.title } 
                    callback={() => this.addLayer(layer)} 
                  />
                  </div>
                ))
                : null
              }
            </Card> 
          </div>
          <div className="small-6 columns">
            <div className="section">
              <div className="title"><FormattedMessage id={"settings.selectedLayers"} /></div>
                <div className="section">
                  {this.props.selectedLayers.map((selectedLayer, i) => (
                    <div key={i}>
                      <SwitchButton 
                        name={`${i}${selectedLayer.attributes.name}`} 
                        labelRight={selectedLayer.attributes.name} 
                        onChange={() => this.toggleLayer(selectedLayer)}
                        defaultChecked={selectedLayer.attributes.enabled}
                      />
                    </div>
                  ))}
                </div>
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
