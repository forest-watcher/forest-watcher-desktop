import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea } from '../form/Form';

import withModal from '../ui/withModal';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

const ModalCard = withModal(Card);

class CustomLayers extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  state = {
    open: false
  }

  onInfoClick = (e) => {
    e.preventDefault();
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  render() {
    const { form, onInputChange, intl } = this.props;
    return (
      <div className="c-custom-layers">
        <button className="info-button" onClick={this.onInfoClick}>
          <Icon className="-small" name="icon-info"/>
        </button>
        <div className="c-form">
          <Input
            type="text"
            className="-question"
            onChange={onInputChange}
            name="title"
            value={form.title || ''}
            placeholder={intl.formatMessage({ id: 'settings.layerTitle' })}
            validations={['required']}
          />
          <Input
            type="text"
            className="-question"
            onChange={onInputChange}
            name="tileurl"
            value={form.tileurl || ''}
            placeholder={intl.formatMessage({ id: 'settings.url' })}
            validations={['required', 'url']}
          />
          <h4>{intl.formatMessage({ id: 'settings.description' })}</h4>
          <Textarea
            type="text"
            onChange={onInputChange}
            name="style"
            value={form.style || ''}
            placeholder={intl.formatMessage({ id: 'settings.description' })}
            validations={[]}
          />
        </div>
        <ModalCard className="-big" open={this.state.open} close={this.closeModal} fields={['This', 'is', 'an', 'example']}/>
      </div>
    );
  }
}

export default CustomLayers;
