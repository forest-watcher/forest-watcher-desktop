import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

function Nav({ loggedIn, logout }) {
  return (
    <nav className="c-nav row">
      <div className="nav-section column medium-3">
        <h1 className="nav-logo">
          <NavLink exact to="/" activeClassName="-active">
            <Icon className="-small" name="icon-forest-watcher-small"/>
            Forest Watcher 2.0
          </NavLink>
        </h1>
      </div>
      <div className="nav-section column medium-offset-4 medium-5">
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
