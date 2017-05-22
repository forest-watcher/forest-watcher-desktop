import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div className="c-dashboard-menu">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/areas">Areas</Link>
      <Link to="/reports">Reports</Link>
    </div>
  );
}

export default Menu;
