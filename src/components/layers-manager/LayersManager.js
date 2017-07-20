import React from 'react';
import PropTypes from 'prop-types';

import LayersForm from './LayersFormContainer';
import LayersSwitcher from './LayersSwitcherContainer';
import FormFooter from '../ui/FormFooter';
import { FormattedMessage } from 'react-intl';

function LayersManager({ isManager, publicLayers, teamLayers, userLayers, setEditing }) {
  return(
    <div className="l-layers-manager">
      <div className="row">
        <div className="small-12 medium-6 columns">
          <LayersSwitcher 
            isManager={ isManager }
            publicLayers={publicLayers}
            teamLayers={teamLayers}
            userLayers={userLayers}
          />
        </div>
        <div className="small-12 medium-5 medium-offset-1 columns">
          <LayersForm 
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

LayersManager.propTypes = {
  userLayers: PropTypes.array.isRequired,
  teamLayers: PropTypes.array.isRequired,
  publicLayers: PropTypes.array.isRequired,
  isManager: PropTypes.bool.isRequired,
  setEditing: PropTypes.func.isRequired
};

export default LayersManager;
