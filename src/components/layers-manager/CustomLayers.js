import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea } from '../form/Form';
import { injectIntl } from 'react-intl';

import withModal from '../ui/withModal';
import Walkthrough from '../ui/Walkthrough';
import Icon from '../ui/Icon';

const WalkthroughModal = withModal(Walkthrough);

import { customLayers as WALKTHROUGH_TEXTS } from '../../constants/walkthrough-texts';

class CustomLayers extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  state = {
    open: false
  }

  componentDidMount = () => {
    this.walkthroughTexts = WALKTHROUGH_TEXTS.map(step => {
      return {
        content: step.content && this.props.intl.formatMessage({ id: step.content }),
        childContent: step.childContent && this.props.intl.formatMessage({ id: step.childContent })
      };
    });
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
            validations={['required']}
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
        <WalkthroughModal
          open={this.state.open}
          close={this.closeModal}
          title={intl.formatMessage({ id: 'customLayers.title'})}
          intro={intl.formatMessage({ id: 'customLayers.intro'})}
          steps={this.walkthroughTexts}
          onAccept={this.closeModal}
        />
      </div>
    );
  }
}

export default injectIntl(CustomLayers);
