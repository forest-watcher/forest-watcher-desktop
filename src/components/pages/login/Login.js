import React from 'react';
import { API_BASE_URL, API_CALLBACK_URL } from '../../../constants';

function LoginButton({ socialNetwork }) {
  const url = `${API_BASE_URL}/auth/${socialNetwork}?token=true&callbackUrl=${API_CALLBACK_URL}`
  return (
    <div className={`c-login-button -${socialNetwork}`}>
      <a href={url}>
        <span>{socialNetwork}</span>
      </a>
    </div>
  );
}

function Login() {
    return (
      <div className="l-login">
        <div className="c-login">
          <LoginButton socialNetwork="facebook" />
          <LoginButton socialNetwork="twitter" />
          <LoginButton socialNetwork="google" />
        </div>
      </div>
    );
}

export default Login;
