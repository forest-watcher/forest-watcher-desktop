import React from 'react';
import AreaTile from '../../ui/AreaTile.js';
import Menu from '../../semantic/menu/Menu.js';

class Areas extends React.Component {

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
        <div className="c-dashboard">
          <div className="content-section areas">
            <h4>Areas</h4>
            <ul>
              {areas}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Areas;
