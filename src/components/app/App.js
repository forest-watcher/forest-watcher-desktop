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
import { DEFAULT_LANGUAGE } from '../../constants/global';

addLocaleData([...en, ...es, ...fr, ...id, ...pt]);

// Pages
import Login from '../pages/login/Login';
import Areas from '../pages/areas/AreasContainer';
import AreasManage from '../pages/areas-manage/AreasManageContainer';
import Templates from '../pages/templates/TemplatesContainer';
import TemplatesManage from '../pages/templates-manage/TemplatesManageContainer';
import Settings from '../pages/settings/SettingsContainer';
import Reports from '../pages/reports/ReportsContainer';
import Landing from '../pages/landing/Landing';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

import Nav from '../layouts/Nav';

class App extends React.Component {

  componentWillMount() {
    this.props.checkLogged(this.props.location.search);
  }

  componentDidMount() {
    this.checkConfirmedUser(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.checkConfirmedUser(nextProps);
  }

  checkConfirmedUser(props) {
    const queryParams = querystring.parse(props.location.search);
    const confirmToken = queryParams.confirmToken;
    if (confirmToken && props.user.token) this.props.confirmUser(confirmToken);
  }

  getRootComponent = () => {
    const { user, location } = this.props;
    const search = location.search || '';
    const queryParams = querystring.parse(search);
    const callbackUrl = queryParams.callbackUrl;
    if (!user.loggedIn && !queryParams.token) return <Login callbackUrl={callbackUrl}/>;
    return <Redirect to="/areas" />;
  }

  render() {
    const { match, user, userChecked, logout, locale, setLocale } = this.props;
    if (!userChecked) return null;
    const queryParams = querystring.parse(location.search || '');
    const callbackUrl = queryParams.callbackUrl;
    const confirmToken = queryParams.confirmToken;
    const mergedMessages = Object.assign({}, translations[DEFAULT_LANGUAGE], translations[locale]);
    return (
      <IntlProvider 
        locale={locale}
        messages={mergedMessages}
      >
        <div>
          <header className="l-header" role="banner">
            <Nav 
              loggedIn={user.loggedIn} 
              logout={logout} 
              locale={locale}
              setLocale={setLocale}
              translations={translations}
            />
          </header>
          <main role="main" className="l-main">
            <Route exact path="/" render={this.getRootComponent} />
            {user.loggedIn &&
              <div>
                <Switch>
                  <Route exact path={`${match.url}landing`} component={Landing} />
                  <Route exact path={`${match.url}areas`} component={Areas} />
                  <Route exact path={`${match.url}areas/create`} component={AreasManage} />
                  <Route exact path={`${match.url}areas/:areaId`} component={AreasManage} />
                </Switch>
                <Switch>
                  <Route exact path={`${match.url}templates`} component={Templates} />
                  <Route exact path={`${match.url}templates/create`} component={TemplatesManage} />
                  <Route exact path={`${match.url}templates/:templateId`} component={TemplatesManage} />
                </Switch>
                <Switch>
                  <Route exact path={`${match.url}reports`} component={Reports} />
                  <Route path={`${match.url}reports/:templateId`} component={Reports} />
                </Switch>
                <Route exact path={`${match.url}settings`} component={Settings} />
              </div>
            }
            {!user.loggedIn &&
              ((callbackUrl || confirmToken) ?
                <Redirect to={{
                  pathname: '/',
                  search: location.search
                }}/> :
                <Redirect to={'/'}/>)
            }
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
