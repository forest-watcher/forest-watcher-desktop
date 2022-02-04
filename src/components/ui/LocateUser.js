import React from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";
import { toastr } from "react-redux-toastr";
import { injectIntl } from "react-intl";

class LocateUser extends React.Component {
  setLocation = () => {
    this.props.setLoading(true);
    this.props.map
      .locate({
        setView: true,
        maxZoom: 15
      })
      .on("locationfound", e => {
        this.props.onZoomChange && this.props.onZoomChange(this.props.map.getZoom());
        this.props.setLoading(false);
      })
      .on("locationerror", e => {
        toastr.error(this.props.intl.formatMessage({ id: "areas.locateUserError" }));
        this.props.setLoading(false);
      });
  };

  render() {
    return (
      <div className="c-locate-user">
        <button className="button -map" type="button" onClick={this.setLocation}>
          <Icon name="icon-location" className="-small" />
        </button>
      </div>
    );
  }
}

LocateUser.propTypes = {
  map: PropTypes.object
};

export default injectIntl(LocateUser);
