import React from 'react';

import TopBar from '../topbar/TopBar';

class App extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.checkLogged(this.props.location.query.token);
  }

  render() {
    if (!this.props.userChecked) return null;

    return (
      <div>
        <main role="main" className="l-main">
          <TopBar />
          <div className="l-content">
            {this.props.main}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
