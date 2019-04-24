import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Confirm extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    subtext: PropTypes.string,
    onAccept: PropTypes.func,
    onCancel: PropTypes.func,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string
  };

  onAccept = (e) => {
    e.preventDefault();
    const { onAccept } = this.props;
    if (onAccept) {
      onAccept();
    }
  }

  onCancel = (e) => {
    e.preventDefault();
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  render() {
    const { title, subtext, cancelText, confirmText } = this.props;
    return (
      <div className="c-modal-content">
        <div className="modal-content-inner">
          <h2 className="modal-content-header u-padding-bottom-small u-margin-bottom text -small-title -green test-title">{title}</h2>
          <p className="text u-padding-bottom-small">{subtext}</p>
          <div className="modal-content-action u-margin-top-large">
            <button className="c-button -small u-text-center u-margin-right-tiny test-cancel-button" onClick={this.onCancel}>{cancelText}</button>
            <button className="c-button -small u-text-center test-confirm-button" onClick={this.onAccept}>{confirmText}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirm;
