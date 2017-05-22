import React from 'react';

function LoginButton({ socialNetwork }) {
  const url = `${process.env.REACT_APP_API_AUTH}/auth/${socialNetwork}?token=true&callbackUrl=${process.env.REACT_APP_API_AUTH_CALLBACK_URL}`
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
