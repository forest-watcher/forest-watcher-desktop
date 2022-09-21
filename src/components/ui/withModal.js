/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Component } from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";

function withModal(WrappedComponent) {
  return class withModalHOC extends Component {
    static displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
    static propTypes = {
      open: PropTypes.bool.isRequired,
      close: PropTypes.func.isRequired
    };

    UNSAFE_componentWillMount() {
      window.addEventListener("keyup", this.onKeyup);
    }

    componentDidUpdate() {
      const overflow = this.props.open ? "hidden" : "auto";
      document.querySelector("body").style.overflow = overflow;
    }

    componentWillUnmount() {
      window.removeEventListener("keyup", this.onKeyup);
    }

    onKeyup = e => {
      if (e.key === "Escape") this.props.close();
    };

    stopPropagation(e) {
      e.stopPropagation();
    }

    render() {
      const { open, close, ...props } = this.props; // eslint-disable-line
      if (!open) return null;
      return (
        <article className="c-modal" onClick={close}>
          <div className="modal-container" onClick={this.stopPropagation}>
            <div className="modal-frame">
              <button className="modal-close-icon" onClick={close}>
                <Icon name="icon-close" className="-medium" />
              </button>
              <div className="modal-content">
                <WrappedComponent {...props} />
              </div>
            </div>
          </div>
        </article>
      );
    }
  };
}

export default withModal;
