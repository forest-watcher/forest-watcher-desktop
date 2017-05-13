import React from 'react';

class AreaTile extends React.Component {
  render() {
    return (
      <div className="c-area-tile">
        <h5>{this.props.data.attributes.name}</h5>
        {this.props.data.id}
        <div className="area-image">
          <img src={this.props.data.attributes.image} />
        </div>
      </div>
    );
  }
}

export default AreaTile;
