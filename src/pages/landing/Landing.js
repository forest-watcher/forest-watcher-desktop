import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { LIVE_SETTINGS, GFW_ASSETS_PATH } from '../../constants/landing';
import SocialFooter from './SocialFooter';
import Select from 'react-select';

class Landing extends React.Component {

  static propTypes = {
    locale: PropTypes.string,
    setLocale: PropTypes.func,
    translations: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.languages = props.translations && Object.keys(props.translations).map((lang) => (
      { value: lang, label: lang.toUpperCase() }
    ));
  }

  componentDidMount() {
    this.script = document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.async = true;
    this.script.innerHTML = LIVE_SETTINGS;

    document.head.appendChild(this.script);

    this.scriptLoader = document.createElement('script');
    this.scriptLoader.type = 'text/javascript';
    this.scriptLoader.async = true;
    this.scriptLoader.id = 'loader-gfw';
    this.scriptLoader.src = GFW_ASSETS_PATH;

    document.head.appendChild(this.scriptLoader);
  }

  componentWillUnmount(){
    document.head.removeChild(this.script);
    document.head.removeChild(this.scriptLoader);
    window._babelPolyfill = false;
  }

  handleIosLink() {
    window.location = 'https://itunes.apple.com/us/app/forest-watcher/id1277787116';
  }

  handleAndroidLink() {
    window.location = 'https://play.google.com/store/apps/details?id=com.forestwatcher';
  }

  handleLanguageChange(e) {
    this.props.setLocale(e.value);
  }

  render() {
    return (
      <div className="c-landing">
        <div className="landing-nav">
          <div className="locale-container">
            <div className="locale-select-container">
              <Select
                name="locale-select"
                className="c-select"
                value={this.props.locale}
                options={this.languages}
                onChange={this.handleLanguageChange}
                clearable={false}
                searchable={false}
                arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
              />
            </div>
          </div>
          <div id="headerGfw"></div>
        </div>
        <div className="row landing-content">
          <div className="column align-middle small-12 medium-12 large-6 info-column gwf-grid-adjusted">
            <div className="main">
              <h1><FormattedMessage id="app.name" /></h1>
              <h2><FormattedMessage id="app.description" /></h2>
              <div className='build-buttons'>
                <a className='button-ios-image' onClick={this.handleIosLink}></a>
                <a className='button-android-image' onClick={this.handleAndroidLink}></a>
              </div>
              <div className="description">
                <FormattedMessage id="app.desktopDescription" />
              </div>
              <Link className="login-button c-button" to={'/login'}>
                <FormattedMessage id="app.accessDesktopApp" />
              </Link>
              <div className="landing-links">
                <a
                  href="https://bit.ly/ForestWatcherApp"
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
