import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Input, Form, Textarea } from '../form/Form';
import Card from '../ui/Card';
import Tab from '../ui/Tab';
import { includes } from '../../helpers/utils';
import Checkbox from '../ui/Checkbox';
import { toastr } from 'react-redux-toastr';
import { injectIntl } from 'react-intl';
import { MAX_NUMBER_OF_LAYERS } from '../../constants/global';

class LayersForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      GFWLayers: props.GFWLayers || [],
      teamMode: false,
      form: {
        title: null,
        tileurl: null,
        style: null
      }
    }

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
      if(stateGFWlayer.cartodb_id === GFWLayer.cartodb_id){
        stateGFWlayer.enabled = !stateGFWlayer.enabled;
      }
      return stateGFWlayer
    });
    this.setState({GFWLayers});
  }

  resetForm =  () => {
    const form = Object.assign({}, {
      title: '',
      tileurl: '',
      style: ''
    });
    this.setState({ form });
  }

  maxLayers = (GFWLayer, teamId, userLayerLength, teamLayerLength) => {
    return ((teamId && teamLayerLength > MAX_NUMBER_OF_LAYERS) || (!teamId && userLayerLength > MAX_NUMBER_OF_LAYERS));
  }

  alreadyExist = (GFWLayer, teamId, userLayerNames, teamLayerNames) => {
    return ((teamId && includes(teamLayerNames, GFWLayer.title)) || (!teamId && includes(userLayerNames, GFWLayer.title)));
  }

  addLayers = (e) => {
    e.preventDefault();
    const teamId = this.state.teamMode ? this.props.team.id : null;
    const typeOfLayer = teamId ? 'settings.teamLayers' : 'settings.userLayers';
    const userLayerNames = this.props.userLayers.map((selectedLayer) => selectedLayer.attributes.name);
    const teamLayerNames = this.props.teamLayers.map((selectedLayer) => selectedLayer.attributes.name);   
    let userLayerLength = userLayerNames.length;
    let teamLayerLength = teamLayerNames.length;

    if (this.state.tabIndex === 0) { // GFW Layers
      const resetedLayers = this.state.GFWLayers.map((GFWLayer) => {
        if (GFWLayer.enabled && 
          this.addLayer(GFWLayer, teamId, userLayerNames, teamLayerNames, userLayerLength, teamLayerLength, typeOfLayer)) {
          // Prevents the user from adding several layers on a batch that exceeds the limit
          teamId ? teamLayerLength += 1 : userLayerLength += 1; 
          GFWLayer.enabled = false;
        }
        return GFWLayer
      });
      this.setState({ GFWLayers: resetedLayers });
    } else { // Custom Layers
      if (Object.keys(this.formNode.getErrors()).length === 0) { // No validation errors
        if (this.addLayer(this.state.form, teamId, userLayerNames, teamLayerNames, userLayerLength, teamLayerLength, typeOfLayer)){
          this.resetForm();
        };
      } else {
        toastr.error(this.props.intl.formatMessage({ id: 'settings.validationError' }));
      }
    }
  }

  addLayer = (layer, teamId, userLayerNames, teamLayerNames, userLayerLength, teamLayerLength, typeOfLayer) => {    
    if (this.maxLayers(layer, teamId, userLayerLength, teamLayerLength)) {
      toastr.error(
        this.props.intl.formatMessage({ id: 'settings.maxNumberLayers' }), 
        this.props.intl.formatMessage({ id: typeOfLayer }) 
      );
      return false;
    } 
    if (this.alreadyExist(layer, teamId, userLayerNames, teamLayerNames)){
      toastr.error(this.props.intl.formatMessage({ id: 'settings.layerAlreadyExists' }), layer.title );
      return false;
    }
    this.props.createLayer(layer, teamId);
    return true;
  }

  onInputChange = (e) => {
    const form = Object.assign(this.state.form, { [e.target.name]: e.target.value });
    this.setState({ form });
  }

  render() {
    return (
      <div className="c-layers-form">
        <div className="form-header">
          <h3><FormattedMessage id={"settings.contextualLayers"} /></h3>
          <Tab 
            options={["settings.gfwLayers", "settings.customLayers"]}
            selectedIndex={this.state.tabIndex}
            handleTabIndexChange={this.handleTabIndexChange}
          />
        </div>
        <Form onSubmit={(e) => this.addLayers(e)} ref={ f => this.formNode = f }>
            {this.state.tabIndex === 0 ? 
              this.state.GFWLayers && this.state.GFWLayers.map((GFWlayer, i) => 
                <Checkbox
                  classNames="-spaced -lowercase"
                  key={`${i}${GFWlayer.cartodb_id}`}
                  id={`${i}${GFWlayer.cartodb_id}`} 
                  label={ GFWlayer.title }
                  callback={() => this.toggleGFWLayer(GFWlayer)} 
                  checked={ GFWlayer.enabled || false }
                /> )
            : 
              <Card className="-form -content-full-width">
                <div className="c-form">
                  <Input
                  type="text"
                  className="-question"
                  onChange={this.onInputChange}
                  name="title"
                  value={this.state.form.title || ''}
                  placeholder={this.props.intl.formatMessage({ id: 'settings.layerTitle' })}
                  validations={['required']}
                  />
                  <Input
                  type="text"
                  className="-question"
                  onChange={this.onInputChange}
                  name="tileurl"
                  value={this.state.form.tileurl || ''}
                  placeholder={this.props.intl.formatMessage({ id: 'settings.url' })}
                  validations={['required', 'url']}
                  />
                  <h4>{this.props.intl.formatMessage({ id: 'settings.cssStyle' })}</h4>
                  <Textarea
                    type="text"
                    onChange={this.onInputChange}
                    name="style"
                    value={this.state.form.style || ''}
                    placeholder={this.props.intl.formatMessage({ id: 'settings.cssStyle' })}
                    validations={[]}
                  />
                </div>
              </Card>
            }
          <div className='layer-add'>
            { this.props.team && 
              <Checkbox 
                id={'gfw-teams-add'} 
                labelId={ 'settings.addToTeam' }
                callback={() => this.setState({teamMode: !this.state.teamMode})}
              />
            }
            <button className="c-button -light -right" ><FormattedMessage id="common.add"/></button>
          </div>
        </Form>
      </div>
    );
  }
}

LayersForm.propTypes = {
  userLayers: PropTypes.array.isRequired,
  teamLayers: PropTypes.array.isRequired,
  publicLayers: PropTypes.array.isRequired,
  GFWLayers: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
  createLayer: PropTypes.func.isRequired
};

export default injectIntl(LayersForm);