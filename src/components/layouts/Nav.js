import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';

class Nav extends React.Component {

  handleLanguageChange = (e) => {
    this.props.setLocale(e.value);
  }

  render() {
    const options = [
      { value: 'en', label: 'EN' },
      { value: 'es', label: 'ES' }
    ];
    
    return (
      <div className="row column">
        <nav className="c-nav">
          <h1 className="nav-logo">
            <NavLink exact to="/" activeClassName="-active">
              <Icon className="-small" name="icon-forest-watcher-small"/>
              <FormattedMessage id="app.name" />
            </NavLink>
          </h1>
          <div className="nav-section">
            {this.props.loggedIn &&
              <ul className="nav-subsection">
                <li className="nav-link">
                  <NavLink to="/areas" activeClassName="-active">Areas</NavLink>
                </li>
                <li className="nav-link">
                  <NavLink to="/templates" activeClassName="-active">Templates</NavLink>
                </li>
                <li className="nav-link">
                  <NavLink to="/reports" activeClassName="-active">Reports</NavLink>
                </li>
              </ul>
            }
            {this.props.loggedIn &&
              <ul className="nav-subsection">
                <Select
                  name="locale-select"
                  value={this.props.locale}
                  options={options}
                  onChange={this.handleLanguageChange}
                  clearable={false}
                />
                <li className="nav-menu">
                  <a onClick={this.props.logout}>Log out</a>
                </li>
              </ul>
            }
          </div>
        </nav>
      </div>
    );
  }
}

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func,
  locale: PropTypes.string,
  setLocale: PropTypes.func
};

export default Nav;
