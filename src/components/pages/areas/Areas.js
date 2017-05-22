import React from 'react';
import PropTypes from 'prop-types';

import AreaTile from '../../ui/AreaTile';
import Menu from '../../layouts/menu/Menu';

class Areas extends React.Component {

  componentWillMount() {
    this.props.getUserAreas();
  }

  render() {
    const { areas } = this.props.data || {};
    return (
      <div>
        <Menu />
        <div className="c-dashboard">
          <div className="content-section areas">
            <h4>Areas</h4>
            <ul>
              {areas.map(area => (<li><AreaTile data={area} key={area.id} /></li>))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Areas.propTypes = {
  data: PropTypes.object.isRequired,
  getUserAreas: PropTypes.func.isRequired
};

export default Areas;
