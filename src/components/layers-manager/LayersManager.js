import React from 'react';

import LayersForm from './LayersFormContainer';
import LayersSwitcher from './LayersSwitcherContainer';
import FormFooter from '../ui/FormFooter';
import { FormattedMessage } from 'react-intl';

function LayersManager({ isManager, publicLayers, teamLayers, userLayers, setEditing }) {
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
      <FormFooter>
        <button 
          onClick={() => setEditing(false)} 
          className="c-button -right"
        >
          <FormattedMessage id="common.done" />
        </button>
      </FormFooter>
    </div>
  )
}

export default LayersManager;
