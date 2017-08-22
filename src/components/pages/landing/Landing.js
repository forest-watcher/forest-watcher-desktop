import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import SocialFooter from './SocialFooter';

class Landing extends React.Component {
  componentDidMount(){
    this.script = document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.async = true;
    this.script.innerHTML = "window.liveSettings = {picker: '#transifexTranslateElement',api_key: '9eda410a7db74687ba40771c56abd357',detectlang: false,site: 'gfw-watcher'};";
    document.body.appendChild(this.script);

    this.scriptLoader = document.createElement('script');
    this.scriptLoader.type = 'text/javascript';
    this.scriptLoader.async = true;
    this.scriptLoader.id = 'loader-gfw';
    this.scriptLoader.src = 'http://gfw-assets.s3.amazonaws.com/static/gfw-assets.nightly.js';
    document.body.appendChild(this.scriptLoader);
  }

  componentWillUnmount(){
    document.body.removeChild(this.script);
    document.body.removeChild(this.scriptLoader);
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
              <div className='phone-image'></div>
              <div className='screen-image'></div>
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
