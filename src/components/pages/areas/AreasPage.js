import React from 'react';
import AreaTile from '../../areas/AreaTile.js';
import DashboardMenu from '../../DashboardMenu.js';

class AreasPage extends React.Component {

  componentWillMount() {
    this.props.getUserAreas();
  }

  render() {
    let areas = [];
    for (let i = 0; i < this.props.data.areas.length; i++) {
      areas.push(<li><AreaTile data={this.props.data.areas[i]} key={i} /></li>);
    }

    return (
      <div>
        <DashboardMenu />
        <div className="c-dashboard">
          <div className="content-section areas">
            <h4>Areas</h4>
            <ul>
              {areas}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default AreasPage;
