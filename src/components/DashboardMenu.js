import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DashboardMenu extends Component {
  render() {
    return (
      <div className="c-dashboard-menu">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/areas">Areas</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/templates">Report Templates</Link>
      </div>
    );
  }
}

export default DashboardMenu;
