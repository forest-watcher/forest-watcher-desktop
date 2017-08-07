import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

function withModal(WrappedComponent) {
  return class withModalHOC extends Component {
    static displayName = (WrappedComponent.displayName || WrappedComponent.name || 'Component');
    static propTypes = {
      open: PropTypes.bool.isRequired,
      close: PropTypes.func.isRequired
    };

    componentWillMount() {
      window.addEventListener('keyup', this.onKeyup);
    }

    componentDidUpdate() {
      const overflow = this.props.open ? 'hidden' : 'auto';
      document.querySelector('body').style.overflow = overflow;
    }

    componentWillUnmount() {
      window.removeEventListener('keyup', this.onKeyup);
    }

    onKeyup = (e) => {
      if (e.key === 'Escape') this.props.close();
    }

    stopPropagation(e) {
      e.stopPropagation();
    }

    render() {
      const { open, close, ...props } = this.props; // eslint-disable-line
      if (!open) return null;
      return (
        <section className="c-modal" onClick={close}>
          <div className="modal-container" onClick={this.stopPropagation}>
            <div className="modal-content">
              <button className="modal-close-icon" onClick={close}>
                <Icon name="icon-close" className="-small" />
              </button>
              <WrappedComponent { ...props } />
            </div>
          </div>
        </section>
      );
    }
  };
}

export default withModal;
