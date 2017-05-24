import React from 'react';

class AreaTile extends React.Component {

  render() {
    const { area } = this.props;
    return (
      <div className="c-area-tile">
        <div className="area-image" style={{ backgroundImage: `url(${area.image})`}}></div>
        <h5>{area.name}</h5>
        {area.id}
      </div>
    );
  }
}

export default AreaTile;
