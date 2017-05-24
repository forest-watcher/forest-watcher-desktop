import React from 'react';

class AreaTile extends React.Component {

  render() {
    const { area } = this.props;
    return (
      <div className="c-area-tile">
        <div className="area-image" style={{ backgroundImage: `url(${area.image})`}}></div>
        <p className="area-title">{area.name}</p>
        <div className="area-tile-actions">
        </div>
      </div>
    );
  }
}

export default AreaTile;
