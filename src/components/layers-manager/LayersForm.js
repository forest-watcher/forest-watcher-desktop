import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Input, Form, Textarea } from '../form/Form';
import Card from '../ui/Card';
import Tab from '../ui/Tab';
import Checkbox from '../ui/Checkbox';
import { toastr } from 'react-redux-toastr';
import { injectIntl } from 'react-intl';

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

  addLayers = (e) => {
    e.preventDefault();
    if (this.state.tabIndex === 0) { // GFW Layers
      const resetedLayers = this.state.GFWLayers.map((GFWLayer) => {
        if (GFWLayer.enabled){
          this.addLayer(GFWLayer);
          GFWLayer.enabled = false;
        }
        return GFWLayer
      });
      this.setState({ GFWLayers: resetedLayers });
    } else { // Custom Layers
      if (Object.keys(this.formNode.getErrors()).length === 0) { // No validation errors
        this.addLayer(this.state.form);
        this.resetForm();
      } else {
        toastr.error(this.props.intl.formatMessage({ id: 'settings.validationError' }));
      }
    }
  }

  addLayer = (layer) => {
    const teamId = this.state.teamMode ? this.props.team.id : null;
    this.props.createLayer(layer, teamId);
  }

  onInputChange = (e) => {
    const form = Object.assign(this.state.form, { [e.target.name]: e.target.value });
    this.setState({ form });
  }

  render() {
    return (
      <div className="c-layers-form">
        <h3><FormattedMessage id={"settings.contextualLayers"} /></h3>
        <Tab 
          options={["settings.gfwLayers", "settings.customLayers"]}
          selectedIndex={this.state.tabIndex}
          handleTabIndexChange={this.handleTabIndexChange}
        />
        <Form onSubmit={(e) => this.addLayers(e)} ref={ f => this.formNode = f }>
          <Card className={"-big"}>
            {this.state.tabIndex === 0 ? 
              this.state.GFWLayers && this.state.GFWLayers.map((GFWlayer, i) => 
                <Checkbox
                  classNames="-spaced"
                  key={`${i}${GFWlayer.cartodb_id}`}
                  id={`${i}${GFWlayer.cartodb_id}`} 
                  label={ GFWlayer.title }
                  callback={() => this.toggleGFWLayer(GFWlayer)} 
                  checked={ GFWlayer.enabled || false }
                />
              ) : 
              <div className="custom-layer-form">
                <h4>{this.props.intl.formatMessage({ id: 'settings.layerTitle' })}</h4>
                <Input
                type="text"
                onChange={this.onInputChange}
                name="title"
                value={this.state.form.title || ''}
                placeholder={this.props.intl.formatMessage({ id: 'settings.layerTitle' })}
                validations={['required']}
                />
                <h4>{this.props.intl.formatMessage({ id: 'settings.url' })}</h4>
                <Input
                type="text"
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
            }
          </Card>
          <div className='card-actions'>
            { this.props.team && 
              <Checkbox 
                id={'gfw-teams-add'} 
                labelId={ 'settings.addToTeam' }
                callback={() => this.setState({teamMode: !this.state.teamMode})}
              />
            }
            <button className="c-button -right" ><FormattedMessage id="common.add" /></button>
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