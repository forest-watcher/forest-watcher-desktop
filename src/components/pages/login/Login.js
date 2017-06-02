import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../ui/Icon';

import { API_BASE_URL, API_CALLBACK_URL } from '../../../constants/global';

function LoginButton({ socialNetwork }) {
  const url =`${API_BASE_URL}/auth/${socialNetwork}?token=true&callbackUrl=${API_CALLBACK_URL}`;
  return (
    <div className={`login-button -${socialNetwork}`}>
      <a href={url}>
        <div className="network-container">
          <Icon className="-white" name={`icon-${socialNetwork}`}/>
          <span>{socialNetwork}</span>
        </div>
        <Icon className="-white -small -rotate-right" name={`icon-arrow-down`}/>
      </a>
    </div>
  );
}



function Login() {
  return (
    <div className="c-login row">
      <div className="column small-12">
        <div className="login-content">
          <div className="login-heading">
            <Icon className="-huge" name="icon-forest-watcher-big" />
            <h1 className="text -logo-title">Forest Watcher 2.0</h1>
            <p className="text -logo-subtitle">Sign in with a MyGFQ account</p>
          </div>
          <LoginButton socialNetwork="facebook" />
          <LoginButton socialNetwork="twitter" />
          <LoginButton socialNetwork="google" />
        </div>
      </div>
    </div>
  );
}

LoginButton.propTypes = {
  socialNetwork: PropTypes.string
};

export default Login;
