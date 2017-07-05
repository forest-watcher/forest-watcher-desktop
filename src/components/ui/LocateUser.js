import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

export default class LocateUser extends React.Component {

  setLocation = () => {
    this.props.map.locate({setView: true});
  }

  render() {
    return (
      <div className="c-locate-user">
        <button className="button" type="button" onClick={this.setLocation}>
          <Icon name="icon-location" className="-small" />
        </button>
      </div>
    );
  }
}

LocateUser.propTypes = {
  map: PropTypes.object
};
