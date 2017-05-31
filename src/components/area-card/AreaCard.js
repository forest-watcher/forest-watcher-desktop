import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../ui/Icon';

class AreaCard extends React.Component {

  render() {
    const { area } = this.props;
    return (
      <div className="c-area-card">
        <div className="area-content">
          <figure className="area-image" style={{ backgroundImage: `url(${area.image})`}}></figure>
          <figcaption className="area-title">{area.name}</figcaption>
        </div>
        <ul className="area-actions">
          <li className="area-action">
            <button className="c-button -light -small">Reports</button>
          </li>
          <li className="area-action -edit-area">
            <button className="c-button -round -white">
              <Icon className="-small -green" name="icon-edit"/>
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

AreaCard.propTypes = {
  area: PropTypes.object.isRequired
};

export default AreaCard;
