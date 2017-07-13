import React from 'react';

import LayersForm from './LayersFormContainer';
import LayersSwitcher from './LayersSwitcherContainer';

class LayersManager extends React.Component {  
  render() {
    return (
      <div className="c-layers-manager">
        <div className="row">
          <div className="small-5 columns">
            <LayersForm />
          </div>
          <div className="small-offset-1 small-6 columns">
            <LayersSwitcher />
          </div>
        </div>
      </div>
    );
  }
}

export default LayersManager;
