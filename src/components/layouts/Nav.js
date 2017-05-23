import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function Nav({ loggedIn, logout }) {
  return (
    <nav className="c-nav wrapper">
      <div className="nav-section">
        <h1 className="nav-logo">
          <NavLink exact to="/" activeClassName="-active">Forest Watcher 2.0</NavLink>
        </h1>
      </div>
      <div className="nav-section">
        {loggedIn &&
          <ul className="nav-subsection">
            <li className="nav-link">
              <NavLink to="/areas" activeClassName="-active">Areas</NavLink>
            </li>
            <li className="nav-link">
              <NavLink to="/reports" activeClassName="-active">Reports</NavLink>
            </li>
          </ul>
        }
        {loggedIn &&
          <ul>
            <li className="nav-menu">
              <a onClick={logout}>Log out</a>
            </li>
          </ul>
        }
      </div>
    </nav>
  );
}

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func
};

export default Nav;
