import React from 'react';
import { MAP_CONFIG } from '../../constants/map';

function Attribution() {
  return (
    <div className="c-leaflet-attribution leaflet-control">
      <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>
      { MAP_CONFIG.attribution }
    </div>
  );
}

export default Attribution;
