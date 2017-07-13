import React from 'react';

import Map from '../../map/Map';
import LayersForm from './LayersFormContainer';
import LayersSwitcher from './LayersSwitcherContainer';

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
      }
    }
  }
  
  render() {
    return (
      <div className="c-layers-manager">
        <div className="row">
          <div className="small-6 columns">
            <LayersForm />
          </div>
          <div className="small-6 columns">
            <LayersSwitcher />
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
