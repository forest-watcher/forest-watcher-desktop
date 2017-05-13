import React from 'react';
import AreaTile from '../../areas/AreaTile.js'
import DashboardMenu from '../../DashboardMenu.js'

class DashboardPage extends React.Component {

  componentWillMount() {
    // console.log(this.props);
    this.props.getUserAreas();
    // this.props.getUserReports();
    // this.props.getUserQuestionares();
  }

  render() {
    let areas = [];
    for (let i = 0; i < this.props.data.areas.length; i++) {
      areas.push(<li><AreaTile data={this.props.data.areas[i]} key={i} /></li>);
    }

    return (
      <div>
        <DashboardMenu />
        Welcome to Forest Watcher 2.0. You are logged in.
      </div>
    );
  }
}

export default DashboardPage;
