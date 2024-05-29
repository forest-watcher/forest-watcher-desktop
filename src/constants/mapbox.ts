import MapSatImage from "assets/images/icons/MapSat.png";
import MapLightImage from "assets/images/icons/MapLight.png";
import MapDarkImage from "assets/images/icons/MapDark.png";
import MapPlanetImage from "assets/images/icons/MapPlanet.png";

export const BASEMAPS = {
  satellite: {
    key: "maps.satellite",
    style: "mapbox://styles/mapbox/satellite-v9",
    image: MapSatImage
  },
  light: {
    key: "maps.light",
    style: "mapbox://styles/mapbox/light-v11",
    image: MapLightImage
  },
  dark: {
    key: "maps.dark",
    style: "mapbox://styles/mapbox/dark-v11",
    image: MapDarkImage
  }
};

export const PLANET_BASEMAP = {
  key: "maps.planet",
  style: "mapbox://styles/mapbox/dark-v11",
  image: MapPlanetImage,
  url: `https://tiles.planet.com/basemaps/v1/planet-tiles/{name}/gmap/{z}/{x}/{y}.png?proc={proc}&api_key=${process.env.REACT_APP_PLANET_API_KEY}`
  // url: "https://globalforestwatch.org/api/planet-tiles/{name}/gmap/{z}/{x}/{y}/?proc="
}; // Look at using https://tiles.planet.com/basemaps/v1/planet-tiles/
