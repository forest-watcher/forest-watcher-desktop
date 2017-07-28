import React from 'react';
import { FormattedMessage } from 'react-intl';

class Answers extends React.Component {
  render() {
    const gfwLogo = 'logo-gfw.png'
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
            <div className="log-in-bar">
              <FormattedMessage id="app.alreadyHaveAnAccount" />
              <button className="c-button" onClick={this.handleIosLink}>
                <FormattedMessage id="app.login" />
              </button>
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

export default Answers;
