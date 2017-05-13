import React from 'react';
import Login from '../login/Login';

class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <div className="l-login">
          <Login/>
        </div>
      </div>
    );
  }
}

export default LoginPage;
