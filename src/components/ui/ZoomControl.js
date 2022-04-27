import { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Icon from "./Icon";

export default class ZoomControl extends Component {
  /* Component lifecycle */
  shouldComponentUpdate(newProps) {
    return this.props.zoom !== newProps.zoom;
  }

  setZoom(zoom) {
    this.props.onZoomChange && this.props.onZoomChange(zoom);
  }

  increaseZoom = evt => {
    evt.preventDefault();
    if (this.props.zoom === this.props.maxZoom) return;
    this.setZoom(this.props.zoom + 1);
  };

  decreaseZoom = evt => {
    evt.preventDefault();
    if (this.props.zoom === this.props.minZoom) return;
    this.setZoom(this.props.zoom - 1);
  };

  render() {
    const zoomInClass = classnames("zoom-control-btn", {
      "-disabled": this.props.zoom === this.props.maxZoom
    });

    const zoomOutClass = classnames("zoom-control-btn", {
      "-disabled": this.props.zoom === this.props.minZoom
    });

    return (
      <div className="c-zoom-control">
        <button className={zoomInClass} type="button" onClick={this.increaseZoom}>
          <Icon name="icon-more" className="-small" />
        </button>
        <button className={zoomOutClass} type="button" onClick={this.decreaseZoom}>
          <Icon name="icon-less" className="-small" />
        </button>
      </div>
    );
  }
}

ZoomControl.propTypes = {
  zoom: PropTypes.number,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  onZoomChange: PropTypes.func
};

ZoomControl.defaultProps = {
  zoom: 3,
  maxZoom: 20,
  minZoom: 3
};
