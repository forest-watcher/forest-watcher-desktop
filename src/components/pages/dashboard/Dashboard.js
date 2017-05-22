import React from 'react';
import AreaTile from '../../ui/AreaTile.js'
import Menu from '../../semantic/menu/Menu.js'

class Dashboard extends React.Component {

  componentWillMount() {
    this.props.getUserAreas();
  }

  render() {
    let areas = [];
    for (let i = 0; i < this.props.data.areas.length; i++) {
      areas.push(<li><AreaTile data={this.props.data.areas[i]} key={i} /></li>);
    }

    return (
      <div>
        <Menu />
        Welcome to Forest Watcher 2.0. You are logged in.
      </div>
    );
  }
}

export default Dashboard;
