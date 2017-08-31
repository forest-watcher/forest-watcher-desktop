import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { LIVE_SETTINGS, GFW_ASSETS_PATH } from '../../../constants/landing';
import SocialFooter from './SocialFooter';

class Landing extends React.Component {

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

  render() {
    return (
      <div className="c-landing">
        <div id="headerGfw"></div>
        <div className="row">
          <div className="small-12 medium-6 info-column gwf-grid-adjusted">
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
            </div>
          </div>
          <div className="small-12 medium-offset-1 medium-4 image-column gwf-grid-adjusted">
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
