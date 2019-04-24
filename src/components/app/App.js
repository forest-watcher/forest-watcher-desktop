import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import querystring from 'query-string';
import ReduxToastr from 'react-redux-toastr';
import { IntlProvider } from 'react-intl';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import id from 'react-intl/locale-data/id';
import pt from 'react-intl/locale-data/pt';
import translations from '../../locales/index.js';
import { DEFAULT_LANGUAGE, GA_UA } from '../../constants/global';
import ReactGA from 'react-ga';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import Nav from '../layouts/Nav';

// Pages
import Login from '../../pages/login/Login';
import Areas from '../../pages/areas/AreasContainer';
import AreasManage from '../../pages/areas-manage/AreasManageContainer';
import Templates from '../../pages/templates/TemplatesContainer';
import TemplatesManage from '../../pages/templates-manage/TemplatesManageContainer';
import Settings from '../../pages/settings/SettingsContainer';
import Reports from '../../pages/reports/ReportsContainer';
import Landing from '../../pages/landing/LandingContainer';


addLocaleData([...en, ...es, ...fr, ...id, ...pt]);


class App extends React.Component {

  componentWillMount() {
    this.props.checkLogged(this.props.location.search);
    ReactGA.initialize(GA_UA); //Unique Google Analytics tracking number
  }

  componentDidMount() {
    this.checkConfirmedUser(this.props);
    this.fireTracking(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    const queryParams = querystring.parse(nextProps.location.search);
    const confirmToken = queryParams.confirmToken;
    if ((nextProps.user.token !== this.props.user.token) && confirmToken){
      this.checkConfirmedUser(nextProps);
    }
    if (location.pathname !== this.props.location.pathname || location.search !== this.props.location.search) {
      this.fireTracking(nextProps.location);
    }
  }

  fireTracking = (location) => {
    ReactGA.set({ page: location.pathname + location.search });
    ReactGA.pageview(location.pathname + location.search);
  }

  checkConfirmedUser(props) {
    const queryParams = querystring.parse(props.location.search);
    const confirmToken = queryParams.confirmToken;
    if (confirmToken && props.user.token) this.props.confirmUser(confirmToken);
  }

  getLoginComponent = () => {
    const { user, location } = this.props;
    const search = location.search || '';
    const queryParams = querystring.parse(search);
    const callbackUrl = queryParams.callbackUrl;
    const confirmToken = queryParams.confirmToken;
    if (!user.loggedIn && queryParams.token && ((callbackUrl || confirmToken) )) {
      return <Redirect to={{
        pathname: '/login',
        search: location.search
      }}/>;
    } else if (user.loggedIn) {
      return <Redirect to="/areas" />;
    } else {
      return <Login callbackUrl={callbackUrl}/>;
    }
  }
  redirectToLogin(){
    return <Redirect to="/login" />;
  }
  render() {
    const { match, user, userChecked, logout, locale, setLocale } = this.props;
    if (!userChecked) return null;
    const queryParams = querystring.parse(window.location.search || '');
    const mergedMessages = Object.assign({}, translations[DEFAULT_LANGUAGE], translations[locale]);
    return (
      <IntlProvider
        locale={locale}
        messages={mergedMessages}
      >
        <div>
          { ((user.loggedIn && window.location.pathname !== '/') || window.location.pathname === "/login") &&
            <header className="l-header" role="banner">
            <Nav
              loggedIn={user.loggedIn}
              logout={logout}
              locale={locale}
              setLocale={setLocale}
              translations={translations}
              user={user}
            />
          </header>}
          <main role="main" className="l-main">
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Landing
                  locale={locale}
                  setLocale={setLocale}
                  translations={translations} />
                )}
              />
              <Route path={`${match.url}login`} render={this.getLoginComponent} />
              {user.loggedIn ?
                <Switch>
                  <Route exact path={`${match.url}areas`} component={Areas} />
                  <Route exact path={`${match.url}areas/create`} component={AreasManage} />
                  <Route exact path={`${match.url}areas/:areaId`} component={AreasManage} />
                  <Route exact path={`${match.url}templates`} component={Templates} />
                  <Route exact path={`${match.url}templates/create`} component={TemplatesManage} />
                  <Route exact path={`${match.url}templates/:templateId`} component={TemplatesManage} />
                  <Route exact path={`${match.url}reports`} component={Reports} />
                  <Route path={`${match.url}reports/:templateId`} component={Reports} />
                  <Route exact path={`${match.url}settings`} component={Settings} />
                </Switch>
                :
                !queryParams.token && <Route path={`${match.url}`} render={this.redirectToLogin} />
              }
            </Switch>
            <ReduxToastr
              position="bottom-right"
              transitionIn="fadeIn"
              transitionOut="fadeOut"
            />
          </main>
        </div>
      </IntlProvider>
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  userChecked: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  checkLogged: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  locale: PropTypes.string,
  setLocale: PropTypes.func
};

export default App;
