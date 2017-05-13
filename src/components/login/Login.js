import React, { Component } from 'react';
import LoginButton from './LoginButton'

class Login extends Component {
  render() {
    return (
      <div className="c-login">
        <LoginButton socialNetwork="facebook" />
        <LoginButton socialNetwork="twitter" />
        <LoginButton socialNetwork="google" />
      </div>
    );
  }
}

export default Login;
