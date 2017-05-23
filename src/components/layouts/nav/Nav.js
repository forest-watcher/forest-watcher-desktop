import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function Nav({ user, logout }) {
  return (
    <nav className="c-nav">
      <div className="nav-section">
        <h1 className="nav-link -accent -left">
          <NavLink exact to="/" activeClassName="-active">Forest Watcher 2.0</NavLink>
        </h1>
      </div>
      <div className="nav-section">
        {user.loggedIn &&
          <ul className="nav-subsection">
            <li className="nav-link">
              <NavLink to="/areas" activeClassName="-active">Areas</NavLink>
            </li>
            <li className="nav-link">
              <NavLink to="/reports" activeClassName="-active">Reports</NavLink>
            </li>
          </ul>
        }
        {user.loggedIn &&
          <ul>
            <li className="nav-link -accent -right">
              <a onClick={logout}>Log out</a>
            </li>
          </ul>
        }
      </div>
    </nav>
  );
}

Nav.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func
};

export default Nav;
