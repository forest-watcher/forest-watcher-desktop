import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.languages = Object.keys(props.translations).map((lang) => (
      { value: lang, label: lang.toUpperCase() }
    ));
  }

  handleLanguageChange = (e) => {
    this.props.setLocale(e.value);
  }

  render() {
    const { user } = this.props;
    const username = user.data && user.data.email || <FormattedMessage id="app.setupEmail" />;
    const setUpEmailLink = (!user.data || !user.data.email) ? 'https://www.globalforestwatch.org/my_gfw' : 'javascript:false;';
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
                  <NavLink to="/areas" activeClassName="-active"><FormattedMessage id="areas.name" /></NavLink>
                </li>
                <li className="nav-link">
                  <NavLink to="/templates" activeClassName="-active"><FormattedMessage id="templates.name" /></NavLink>
                </li>
                <li className="nav-link">
                  <NavLink to="/reports" activeClassName="-active"><FormattedMessage id="reports.name" /></NavLink>
                </li>
                <li className="nav-link">
                  <NavLink to="/settings" activeClassName="-active"><FormattedMessage id="settings.name" /></NavLink>
                </li>
                <li className={`nav-link ${user.data && user.data.email ? '-disabled' : ''}`}>
                  <a href={setUpEmailLink}>{username}</a>
                </li>
              </ul>
            }
            <ul className={this.props.loggedIn ? "nav-subsection -settings" : "nav-subsection"}>
              <Select
                name="locale-select"
                className="c-select -dark"
                value={this.props.locale}
                options={this.languages}
                onChange={this.handleLanguageChange}
                clearable={false}
                searchable={false}
                arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
              />
              {this.props.loggedIn &&
                <li className="nav-menu">
                  <a onClick={this.props.logout}><FormattedMessage id="app.logout" /></a>
                </li>
              }
            </ul>
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
  setLocale: PropTypes.func,
  user: PropTypes.object
};

export default Nav;
