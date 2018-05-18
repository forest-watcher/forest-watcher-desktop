import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class AreaCard extends React.Component {

  handleAreaDelete = () => {
    const { area, deleteArea } = this.props;
    deleteArea(area.id);
  }

  render() {
    const { area, templates, user } = this.props;
    return (
      <div className="c-area-card">
        <div className="area-content">
          <figure className="area-image" style={{ backgroundImage: `url(${area.image})`}}></figure>
          <div className="area-detail">
            <div className="area-title">
              <figcaption className="text -small-title">{area.name}</figcaption>
              { user.id === area.userId &&
                <div className="area-actions">
                  <Link className="c-button -circle -transparent" to={`/areas/${area.id}`}>
                    <Icon className="-small -gray" name="icon-edit"/>
                  </Link>
                  <button className="c-button -circle -transparent" onClick={this.handleAreaDelete}>
                    <Icon className="-small -gray" name="icon-delete" />
                  </button>
                </div>
              }
            </div>
            <Link className="text -x-small-title -green" to={`/reports/${templates.ids[0] || null}?aoi=${area.id || null}`}><FormattedMessage id="areas.reportsBtn" /></Link>
          </div>
        </div>
      </div>
    );
  }
}

AreaCard.propTypes = {
  area: PropTypes.object.isRequired,
  deleteArea: PropTypes.func.isRequired
};

export default AreaCard;
