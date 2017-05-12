import React from 'react';

import TopBar from '../topbar/TopBar';

class App extends React.Component {

  constructor(props) {
    super(props);
    // this.setLoginStatus = this.setLoginStatus.bind(this);
  }

  storeUserTokenFromUrl() {

  }

  componentWillMount() {

    if (this.props.params.token) {
      this.checkedLogged();
      this.props.setLoginStatus({loggedIn: true, token: true});
    }

    // this.props.setLoginStatus(true);
    if (this.props.user.loggedIn && !this.props.user.data) {
      this.props.getUser();
    }
  }

  render() {
    return (
      <div>
        <TopBar />
        <main role="main" className="l-main">
          <div className="main-content l-app-wrapper">
            <div className="content-content">
              {this.props.main}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
