import React from 'react';

import { FormattedMessage } from 'react-intl';
import Map from '../../map/Map';
import SwitchButton from 'react-switch-button';
import LayersForm from './LayersFormContainer';

class LayersManager extends React.Component {
  constructor(props) {
    super(props);
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
      tabIndex: 0,
      GFWLayers: props.GFWLayers || [],
      teamMode: false
    }
  }
  
  componentWillMount(){
    this.props.getLayers();
  }

  componentWillReceiveProps(nextProps){
    if (this.props.GFWLayers !== nextProps.GFWLayers) {
      this.setState({
        GFWLayers: nextProps.GFWLayers
      })
    }
  }

  handleTabIndexChange = (tabIndex) => {
    this.setState({ tabIndex });
  }

  toggleGFWLayer = (GFWLayer) => {
    const GFWLayers = [].concat(this.state.GFWLayers);
    GFWLayers.map((stateGFWlayer) => {
      if(stateGFWlayer.title === GFWLayer.title){
        stateGFWlayer.enabled = !stateGFWlayer.enabled;
      }
      return stateGFWlayer
    });
    this.setState({GFWLayers});
  }

  addLayers = (e) => {
    e.preventDefault();
    const resetedLayers = this.state.GFWLayers.map((GFWLayer) => {
      if (GFWLayer.enabled){
        this.addLayer(GFWLayer);
        GFWLayer.enabled = false;
      }
      return GFWLayer
    });
    this.setState({ GFWLayers: resetedLayers });
  }

  toggleLayer = (layer) => {
    this.props.toggleLayer(layer, !layer.attributes.enabled);
  }

  render() {
    return (
      <div className="c-layers-manager">
        <div className="row">
          <div className="small-6 columns">
            <LayersForm />
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
                      {selectedLayer.attributes.owner.type === 'TEAM' && 
                      <span className="team-flag"><FormattedMessage id={"settings.team"} /></span>
                      }
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
