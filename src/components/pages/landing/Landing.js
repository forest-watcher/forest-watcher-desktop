import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

class Landing extends React.Component {
  componentDidMount(){
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = "window.liveSettings = {picker: '#transifexTranslateElement',api_key: '9eda410a7db74687ba40771c56abd357',detectlang: false,site: 'gfw-watcher'};";
    document.body.appendChild(script);

    const scriptLoader = document.createElement('script');
    scriptLoader.type = 'text/javascript';
    scriptLoader.async = true;
    scriptLoader.id = 'loader-gfw';
    scriptLoader.src = 'http://gfw-assets.s3.amazonaws.com/static/gfw-assets.nightly.js';
    document.body.appendChild(scriptLoader);
  }
  render() {
    return (
      <div className="c-landing">
        <div id="headerGfw"></div>
        <div className="row">
          <div className="small-12 medium-6">
            <div className='logo-image'></div>
            <div className="main">
              <h1><FormattedMessage id="app.name" /></h1>
              <h2><FormattedMessage id="app.description" /></h2>
              <div className='build-buttons'>
                <a className='button-ios-image' onClick={this.handleIosLink}></a>
                <a className='button-android-image' onClick={this.handleAndroidLink}></a>
              </div>
            </div>
          </div>
          <div className="small-12 medium-offset-1 medium-5">
            <div className="login-bar">
              { this.props.loggedIn ?
                <FormattedMessage id="app.alreadyLoggedIn" />
                :
                <FormattedMessage id="app.alreadyHaveAnAccount" />
              }
              <Link className="login-button c-button" to={'/login'}>
                { this.props.loggedIn ? 
                  <FormattedMessage id="app.goToApp" />
                  :
                  <FormattedMessage id="app.login" />
                }
              </Link>
            </div>
            <div className="phone-screen">
              <div className='phone-image'></div>
              <div className='screen-image'></div>
            </div>
          </div>
        </div>
         <div id="footerGfw"></div>
      </div>
    );
  }
}

export default Landing;
