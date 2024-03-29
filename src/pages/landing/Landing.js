import { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { DOWNLOAD_APK_LINK, DOWNLOAD_APK_VERSION } from "constants/landing";
import SocialFooter from "./SocialFooter";
import ReactGA from "react-ga";

class Landing extends Component {
  static propTypes = {
    locale: PropTypes.string,
    setLocale: PropTypes.func,
    translations: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.languages =
      props.translations && Object.keys(props.translations).map(lang => ({ value: lang, label: lang.toUpperCase() }));
    this.state = {
      gfwBarLoaded: false
    };
  }

  componentWillUnmount() {
    window._babelPolyfill = false;
  }

  handleLanguageChange(e) {
    this.props.setLocale(e.value);
  }

  render() {
    return (
      <div className="c-landing">
        <div className="row landing-content">
          <div className="column align-middle small-12 medium-12 large-6 info-column gwf-grid-adjusted">
            <div className="main">
              <h1>
                <FormattedMessage id="app.name" />
              </h1>
              <h2>
                <FormattedMessage id="app.description" />
              </h2>
              <div className="build-buttons">
                <a className="button-ios-image" href="https://itunes.apple.com/us/app/forest-watcher/id1277787116">
                  <span className="sr-only">
                    <FormattedMessage id="app.iOSAppStore" />
                  </span>
                </a>
                <a
                  className="button-android-image"
                  href="https://play.google.com/store/apps/details?id=com.forestwatcher"
                >
                  <span className="sr-only">
                    <FormattedMessage className="sr-only" id="app.googlePlay" />
                  </span>
                </a>
              </div>
              <span className="text">
                <FormattedMessage id="app.or" />
                &nbsp;
                <ReactGA.OutboundLink
                  eventLabel="Homepage - apk link"
                  to={DOWNLOAD_APK_LINK}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text -green"
                >
                  <FormattedMessage id="app.download" /> .apk (v{DOWNLOAD_APK_VERSION})
                </ReactGA.OutboundLink>
              </span>
              <div className="description">
                <FormattedMessage id="app.webDescription" />
              </div>
              <Link className="login-button c-button c-button--primary" to="/login">
                <FormattedMessage id="app.accessWebApp" />
              </Link>
              <div className="landing-links">
                <a
                  href="https://www.wri.org/blog/2017/09/forest-watcher-brings-data-straight-environmental-defenders"
                  className="text -green"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FormattedMessage id="app.readMoreLink" />
                </a>
                <FormattedMessage id="app.and" />
                <a
                  className="text -green"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.globalforestwatch.org/howto/tags/forest-watcher/"
                >
                  <FormattedMessage id="app.learnHowToLink" />
                </a>
              </div>
            </div>
          </div>
          <div className="column small-12 medium-offset-1 medium-12 large-4 image-column gwf-grid-adjusted">
            <div className="phone-screen">
              <div className="phone-image" />
            </div>
          </div>
        </div>
        <SocialFooter />
        <div id="footerGfw"></div>
      </div>
    );
  }
}

export default Landing;
