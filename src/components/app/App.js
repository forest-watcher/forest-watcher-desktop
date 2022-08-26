import { Component } from "react";
import PropTypes from "prop-types";
import querystring from "query-string";
import ReduxToastr from "react-redux-toastr";
import { IntlProvider } from "react-intl";
import translations from "locales/index.js";
import { DEFAULT_LANGUAGE, GA_UA } from "constants/global";
import ReactGA from "react-ga";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import Nav from "components/layouts/Nav";
import Landing from "pages/landing/LandingContainer";
import UserNameForm from "components/modals/UserNameForm";
import "configureYup";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "components/modals/ErrorFallbackModal";

// Pages
import Routes from "routes";

class App extends Component {
  UNSAFE_componentWillMount() {
    this.props.checkLogged(this.props.location.search);
    ReactGA.initialize(GA_UA); //Unique Google Analytics tracking number
  }

  componentDidMount() {
    this.checkConfirmedUser(this.props);
    this.fireTracking(this.props.location);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    const queryParams = querystring.parse(nextProps.location.search);
    const confirmToken = queryParams.confirmToken;
    if (nextProps.user.token !== this.props.user.token && confirmToken) {
      this.checkConfirmedUser(nextProps);
    }
    if (location.pathname !== this.props.location.pathname || location.search !== this.props.location.search) {
      this.fireTracking(nextProps.location);
    }
  }

  fireTracking = location => {
    ReactGA.set({ page: location.pathname + location.search });
    ReactGA.pageview(location.pathname + location.search);
  };

  checkConfirmedUser(props) {
    const queryParams = querystring.parse(props.location.search);
    const confirmToken = queryParams.confirmToken;
    if (confirmToken && props.user.token) this.props.confirmUser(confirmToken);
  }

  render() {
    const { match, user, userChecked, logout, locale, setLocale, location } = this.props;
    if (!userChecked) return null;
    const mergedMessages = Object.assign({}, translations[DEFAULT_LANGUAGE], translations[locale]);

    return (
      <IntlProvider locale={locale} messages={mergedMessages}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div>
            <header className="l-header" role="banner">
              <Nav
                loggedIn={user.loggedIn}
                logout={logout}
                locale={locale}
                setLocale={setLocale}
                translations={translations}
                user={user}
              />
            </header>

            <main role="main" className="l-main">
              <Routes
                match={match}
                user={user}
                location={location}
                defaultComponent={() => <Landing locale={locale} setLocale={setLocale} translations={translations} />}
              />
              <UserNameForm isOpen={user.userHasNoLastName && location.pathname !== "/"} />
              <ReduxToastr position="bottom-right" transitionIn="fadeIn" transitionOut="fadeOut" preventDuplicates />
            </main>
          </div>
        </ErrorBoundary>
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
