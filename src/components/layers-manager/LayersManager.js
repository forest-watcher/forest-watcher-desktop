import React from 'react';

import LayersForm from './LayersFormContainer';
import LayersSwitcher from './LayersSwitcherContainer';

function LayersManager({ isManager, publicLayers, teamLayers, userLayers }) {
  return(
    <div className="l-layers-manager">
      <div className="row">
        <div className="small-12 medium-5 columns">
          <LayersForm />
        </div>
        <div className="small-12 medium-6 medium-offset-1 columns">
          <LayersSwitcher 
            isManager={ isManager }
            publicLayers={publicLayers}
            teamLayers={teamLayers}
            userLayers={userLayers}
          />
        </div>
      </div>
    </div>
  )
}

export default LayersManager;
