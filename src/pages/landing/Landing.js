import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { GFW_ASSETS_PATH, DOWNLOAD_APK_LINK, DOWNLOAD_APK_VERSION } from '../../constants/landing';
import SocialFooter from './SocialFooter';
import Select from 'react-select';
import Script from 'react-load-script'

class Landing extends React.Component {

  static propTypes = {
    locale: PropTypes.string,
    setLocale: PropTypes.func,
    translations: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.languages = props.translations && Object.keys(props.translations).map((lang) => (
      { value: lang, label: lang.toUpperCase() }
    ));
    this.state = {
      gfwBarLoaded: false
    };
  }

  componentDidMount(){
    this.uglyHackToSetGFWBar(true);
  }

  componentWillUnmount(){
    this.uglyHackToSetGFWBar(false);
    window._babelPolyfill = false;
  }

  uglyHackToSetGFWBar(open) {
    this.header = document.getElementById('headerGfw');
    if (this.header) {
      if (open) {
        this.header.style = 'height: auto; visibility: visible;';
      } else {
        this.header.style = `height: 0px; visibility: hidden;`;
      }
    }
  }

  handleLanguageChange(e) {
    this.props.setLocale(e.value);
  }

  render() {
    return (
      <div className="c-landing">
        <div className="landing-nav">
          {this.state.gfwBarLoaded && <div className="locale-container">
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
          </div>}
          <div id="loader-gfw" />
          <Script
            url={GFW_ASSETS_PATH}
            onLoad={() => {this.setState({gfwBarLoaded: true })}}
          />
        </div>
        <div className="row landing-content">
          <div className="column align-middle small-12 medium-12 large-6 info-column gwf-grid-adjusted">
            <div className="main">
              <h1><FormattedMessage id="app.name" /></h1>
              <h2><FormattedMessage id="app.description" /></h2>
              <div className='build-buttons'>
                <a className='button-ios-image' href="https://itunes.apple.com/us/app/forest-watcher/id1277787116"></a>
                <a className='button-android-image' href="https://play.google.com/store/apps/details?id=com.forestwatcher"></a>
              </div>
              <span className="text"><FormattedMessage id="app.or" />&nbsp;
                <a className='text -green' target="_blank" href={DOWNLOAD_APK_LINK}>
                  <FormattedMessage id="app.download" /> .apk (v{DOWNLOAD_APK_VERSION})
                </a>
              </span>
              <div className="description">
                <FormattedMessage id="app.webDescription" />
              </div>
              <Link className="login-button c-button" to={'/login'}>
                <FormattedMessage id="app.accessWebApp" />
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
