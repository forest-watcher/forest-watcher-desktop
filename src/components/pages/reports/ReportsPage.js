import React from 'react';
import AreaTile from '../../areas/AreaTile.js';
import DashboardMenu from '../../DashboardMenu.js';

class ReportsPage extends React.Component {

  componentWillMount() {
    this.props.getUserReports();
  }

  render() {
    let reports = [];
    for (let i = 0; i < this.props.data.reports.length; i++) {
      reports.push(<li key={i}><AreaTile data={this.props.data.reports[i]} /></li>);
    }

    return (
      <div>
        <DashboardMenu />
        <div className="c-dashboard">
          <div className="content-section reports">
            <h4>Reports</h4>
            <ul>
              {reports}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportsPage;
