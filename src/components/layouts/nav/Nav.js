import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function Nav({ user, logout }) {
  return (
    <nav className="c-nav">
      <ul className="nav-links">
        <li className="nav-link -secondary">
          <NavLink exact to="/">Forest Watcher 2.0</NavLink>
        </li>
      </ul>
      {user.loggedIn &&
        <ul className="nav-links">
          <li className="nav-link">
            <NavLink to="/areas">Areas</NavLink>
          </li>
          <li className="nav-link">
            <NavLink to="/areas">Reports</NavLink>
          </li>
        </ul>
      }
      {user.loggedIn &&
        <ul>
          <li className="nav-link -secondary">
            <a onClick={logout}>Log out</a>
          </li>
        </ul>
      }
    </nav>
  );
}

Nav.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func
};

export default Nav;
