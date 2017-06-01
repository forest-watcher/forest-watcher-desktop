import React from 'react';

import { NavLink } from 'react-router-dom';
import Hero from '../../layouts/Hero';
import Map from '../../map/Map';
import Icon from '../../ui/Icon';

class AreasManage extends React.Component {
  render() {
    return (
      <div>
        <Hero
          title="Create an Area of Interest"
        />
        <Map editable={true}/>
        <div className="row columns">
          <div className="c-form">
            <NavLink to="/areas">
              <button className="c-button -light">Cancel</button>
            </NavLink>
            <div className="area-name">
              <label className="text -x-small-title">Name the area:</label>
              <input type="text" name="area"></input>
            </div>
            <button className="c-button">Save</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AreasManage;
