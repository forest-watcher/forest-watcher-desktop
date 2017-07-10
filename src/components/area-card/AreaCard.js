import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class AreaCard extends React.Component {

  render() {
    const { area, templates } = this.props;
    return (
      <div className="c-area-card">
        <div className="area-content">
          <figure className="area-image" style={{ backgroundImage: `url(${area.image})`}}></figure>
          <div className="area-detail">
            <div className="area-title">
              <figcaption className="text -small-title">{area.name}</figcaption>
              <Link className="c-button -circle -transparent" to={`/areas/${area.id}`}>
                <Icon className="-small -gray" name="icon-edit"/>
              </Link>
            </div>
            <Link className="text -x-small-title -green" to={`/reports/${templates.ids[0] || null}?aoi=${area.id || null}`}><FormattedMessage id="areas.reportsBtn" /></Link>
          </div>
        </div>
      </div>
    );
  }
}

AreaCard.propTypes = {
  area: PropTypes.object.isRequired
};

export default AreaCard;
