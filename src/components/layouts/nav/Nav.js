import React from 'react';
import PropTypes from 'prop-types';

function Nav({ user, logout }) {
  return (
    <nav className="c-nav">
      <li className="nav-home">Forest Watcher 2.0</li>
      {user.loggedIn && <li onClick={logout}>Logout</li>}
    </nav>
  );
}

Nav.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func
};

export default Nav;
