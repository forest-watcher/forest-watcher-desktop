import React, { Component } from 'react';
import { Link } from 'react-router';

class DashboardMenu extends Component {
  render() {
    return (
      <div className="c-dashboard-menu">
        <Link to={`/dashboard`}>Dashboard</Link>
        <Link to={`/dashboard/areas`}>Areas</Link>
        <Link to={`/dashboard/reports`}>Reports</Link>
        <Link to={`/dashboard/questionaires`}>Templates</Link>
      </div>
    );
  }
}

export default DashboardMenu;
