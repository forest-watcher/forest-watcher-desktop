import React from 'react';

import { FormattedMessage } from 'react-intl';
import Card from '../../ui/Card';
import Tab from '../../ui/Tab';
import Checkbox from '../../ui/Checkbox';

class LayersForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      GFWLayers: props.GFWLayers || [],
      teamMode: false
    }
  }
  
  componentWillMount(){
    this.props.getGFWLayers();
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
    const teamId = this.state.teamMode ? this.props.team.id : null;
    this.props.createLayer(layer, teamId);
  }

  render() {
    return (
      <div className="c-layers-form">
        <div className="title"><FormattedMessage id={"settings.contextualLayers"} /></div>
        <Tab 
          options={["settings.gfwLayers", "settings.customLayers"]}
          selectedIndex={this.state.tabIndex}
          handleTabIndexChange={this.handleTabIndexChange}
        />
        <form onSubmit={(e) => this.addLayers(e)}>
          <Card className={"-big"}>
            {this.state.tabIndex === 0 ? 
              this.state.GFWLayers && this.state.GFWLayers.map((GFWlayer, i) => 
                <div key={i}>
                <Checkbox 
                  id={`${i}${GFWlayer.title}`} 
                  label={ GFWlayer.title }
                  callback={() => this.toggleGFWLayer(GFWlayer)} 
                  checked={ GFWlayer.enabled || false }
                />
                </div>
              ) : null
            }
          </Card> 
          <div>
            { this.props.team && 
              <Checkbox 
                id={'gfw-teams-add'} 
                labelId={ 'settings.addToTeam' }
                callback={() => this.setState({teamMode: !this.state.teamMode})}
              />
            }
            <button className="c-button -right" ><FormattedMessage id="common.add" /></button>
          </div>
        </form>
      </div>
    );
  }
}

export default LayersForm;
