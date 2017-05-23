import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../ui/Icon';

import { API_BASE_URL, API_CALLBACK_URL } from '../../../constants';

function LoginButton({ socialNetwork }) {
  const url = `${API_BASE_URL}/auth/${socialNetwork}?token=true&callbackUrl=${API_CALLBACK_URL}`;
  return (
    <div className={`login-button -${socialNetwork}`}>
      <a href={url}>
        <span>{socialNetwork}</span>
      </a>
    </div>
  );
}

function Login() {
  return (
    <div className="c-login row align-middle">
      <div className="login-content">
        <div className="login-heading">
          <Icon className="-huge" name="icon-forest-watcher-big" />
          <h1 className="login-title">Forest Watcher 2.0</h1>
          <p className="login-subtitle">Sign in with a MyGFQ account</p>
        </div>
        <div className="login-button-group">
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
