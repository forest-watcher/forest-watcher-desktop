import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Confirm extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    subtext: PropTypes.string,
    itemInformation: PropTypes.string,
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
    const { title, subtext, cancelText, confirmText, itemInformation } = this.props;
    return (
      <div className="c-modal-content">
        <div className="modal-content-inner">
          <h2 className="text -small-title -green"><span className="test-title">{title}</span> <span className="test-item-information">{itemInformation}</span></h2>
          <p className="text">{subtext}</p>
          <div className="modal-content-action">
            <button className="c-button -small -right u-margin-right-tiny test-cancel-button" onClick={this.onCancel}>{cancelText}</button>
            <button className="c-button -small test-confirm-button" onClick={this.onAccept}>{confirmText}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirm;
