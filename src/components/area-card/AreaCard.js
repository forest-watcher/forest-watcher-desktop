import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class AreaCard extends React.Component {

  render() {
    const { area } = this.props;
    return (
      <div className="c-area-card">
        <div className="area-content">
          <figure className="area-image" style={{ backgroundImage: `url(${area.image})`}}></figure>
          <figcaption className="area-title text -small-title">{area.name}</figcaption>
        </div>
        <ul className="area-actions">
          <li className="area-action">
            <Link className="c-button -light -small" to={'/reports'}><FormattedMessage id="areas.reportsBtn" /></Link>
          </li>
          <li className="area-action -edit-area">
            <Link className="c-button -circle -transparent" to={`/areas/${area.id}`}>
              <Icon className="-small -gray" name="icon-edit"/>
            </Link>
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
