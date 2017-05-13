import React from 'react';

class TopBar extends React.Component {
  render() {
    console.log(this.props);
    if (this.props.user.loggedIn) return (
      <header className="l-top-bar" role="banner">
        <nav className="c-nav">
          <li>Forest Watcher 2.0</li>
          <li onClick={this.props.logout}>Logout</li>
        </nav>
      </header>
    );

    return (
      <header className="l-top-bar" role="banner">
        <nav className="c-nav">
          <li>Forest Watcher 2.0</li>
        </nav>
      </header>
    );
  }
}

export default TopBar;
