import React from 'react';

import Hero from '../../layouts/Hero';
import Map from '../../map/Map';

class AreasCreate extends React.Component {
  render() {
    return (
      <div>
        <Hero
          title="Create an Area"
        />
      <Map />
      </div>
    );
  }
}

export default AreasCreate;
