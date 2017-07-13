import React from 'react';

import { FormattedMessage } from 'react-intl';
import Map from '../../map/Map';
import { includes } from '../../../helpers/utils';
import Card from '../../ui/Card';
import Tab from '../../ui/Tab';
import SwitchButton from 'react-switch-button';
import Checkbox from '../../ui/Checkbox';

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
    this.props.getGFWLayers();
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

  addLayer = (layer) => {
    const layerUrl = layer.tileurl;
    let layerUrls = this.props.selectedLayers.map((l) => l.url);
    if(!includes(layerUrls, layerUrl)){
      layerUrls = layerUrls.concat(layerUrl);
    }
    const teamId = this.state.teamMode ? this.props.team.id : null;
    this.props.createLayer(layer, teamId);
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
                <form onSubmit={(e) => this.addLayers(e)}>
                  {this.state.GFWLayers && this.state.GFWLayers.map((GFWlayer, i) => 
                    <div key={i}>
                    <Checkbox 
                      id={`${i}${GFWlayer.title}`} 
                      label={ GFWlayer.title }
                      callback={() => this.toggleGFWLayer(GFWlayer)} 
                      checked={ GFWlayer.enabled || false }
                    />
                    </div>
                  )}
                  <div>
                    { this.props.team && 
                      <Checkbox 
                        id={'gfw-teams-add'} 
                        labelId={ 'settings.addToTeam' }
                        callback={() => this.setState({teamMode: !this.state.teamMode})}
                      />}
                    <button className="c-button -right" ><FormattedMessage id="common.add" /></button>
                  </div>
                </form>
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
