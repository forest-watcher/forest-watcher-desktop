import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

class Landing extends React.Component {
  render() {
    return (
      <div className="c-landing">
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
      </div>
    );
  }
}

export default Landing;
