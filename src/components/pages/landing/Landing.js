import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class Answers extends React.Component {
  render() {
    return (
      <div className="c-landing">
        <div className="row">
          <div className="small-12 medium-6">
            GFW logo
            <div className="main">
              <h1><FormattedMessage id="app.name" /></h1>
              <h4><FormattedMessage id="app.description" /></h4>
              <button onClick={this.handleIosLink}>
                Button IOS
              </button>
              <button onClick={this.handleAndroidLink}>
                Button Android
              </button>
              <ul>
              </ul>
            </div>
          </div>
          <div className="small-12 medium-offset-1 medium-5">
            <div className="log-in-bar">
              <FormattedMessage id="app.alreadyHaveAnAccount" />
              <button className="c-button" onClick={this.handleIosLink}>
                <FormattedMessage id="app.login" />
              </button>
            </div>
            <div className="phone-image">
              Phone Image
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Answers;
