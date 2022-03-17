import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
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
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import Nav from '../layouts/Nav';

// Pages
import Landing from '../../pages/landing-closed/Landing';


addLocaleData([...en, ...es, ...fr, ...id, ...pt]);


class App extends React.Component {

  render() {
    const { locale, setLocale } = this.props;
    const mergedMessages = Object.assign({}, translations[DEFAULT_LANGUAGE], translations[locale]);
    return (
      <IntlProvider
        locale={locale}
        messages={mergedMessages}
      >
        <div>
          <main role="main" className="l-main">
            <Landing
              locale={locale}
              setLocale={setLocale}
              translations={translations} />
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
