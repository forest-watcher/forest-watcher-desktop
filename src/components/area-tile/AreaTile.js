import React from 'react';
import Icon from '../ui/Icon';

class AreaTile extends React.Component {

  render() {
    const { area } = this.props;
    return (
      <div className="c-area-tile">
        <div className="area-content">
          <div className="area-image" style={{ backgroundImage: `url(${area.image})`}}></div>
          <p className="area-title">{area.name}</p>
        </div>
        <ul className="area-actions">
          <li className="area-action">
            <button className="c-button -light -small">Reports</button>
          </li>
          <li className="area-action -edit-area">
            <button className="c-button -round -white">
              <Icon className="-small -green" name="icon-edit"/>
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default AreaTile;
