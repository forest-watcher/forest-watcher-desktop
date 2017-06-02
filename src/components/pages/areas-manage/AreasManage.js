import React from 'react';

import { Link } from 'react-router-dom';
import Hero from '../../layouts/Hero';
import Map from '../../map/Map';

class AreasManage extends React.Component {
  render() {
    return (
      <div>
        <Hero
          title="Create an Area of Interest"
        />
        <Map
          editable={true}
          onPolygonComplete={(featureGroup) => {}}
        />
        <div className="row columns">
          <div className="c-form">
            <Link to="/areas">
              <button className="c-button -light">Cancel</button>
            </Link>
            <div className="area-name">
              <label className="text -x-small-title">Name the area:</label>
              <input type="text" name="area"/>
            </div>
            <input type="hidden" />
            <button className="c-button">Save</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AreasManage;
