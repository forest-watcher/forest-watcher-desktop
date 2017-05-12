import React, { Component } from 'react';

class LoginButton extends Component {

  render() {
    const url = `${process.env.REACT_APP_API_AUTH}/auth/${this.props.socialNetwork}?token=true&callbackUrl=${process.env.REACT_APP_API_AUTH_CALLBACK_URL}`
    return (
      <div>
        <a href={url}>{this.props.socialNetwork}</a>
      </div>
    );
  }
}

export default LoginButton;
