import React from 'react';
import PropTypes from 'prop-types';

function Nav({ user, logout }) {
  return (
    <header className="l-header" role="banner">
      <nav className="c-nav">
        <li>Forest Watcher 2.0</li>
        {user.loggedIn && <li onClick={logout}>Logout</li>}
      </nav>
    </header>
  );
}

Nav.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func
};

export default Nav;
