import React from 'react';

import TopBar from '../topbar/TopBar';

class App extends React.Component {
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
