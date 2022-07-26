import MapSatImage from "assets/images/icons/MapSat.png";
import MapLightImage from "assets/images/icons/MapLight.png";
import MapDarkImage from "assets/images/icons/MapDark.png";
import MapPlanetImage from "assets/images/icons/MapPlanet.png";

export const BASEMAPS = {
  satellite: {
    key: "maps.satellite",
    style: "mapbox://styles/3sidedcube/cl5axl8ha002c14o5exjzmdlb",
    image: MapSatImage
  },
  light: {
    key: "maps.light",
    style: "mapbox://styles/3sidedcube/cl5s9e9d8000814rvhgohedy4",
    image: MapLightImage
  },
  dark: {
    key: "maps.dark",
    style: "mapbox://styles/3sidedcube/cl5s9hhoj000414mrsifh4yn6",
    image: MapDarkImage
  },
  planet: {
    key: "maps.planet",
    style: "mapbox://styles/3sidedcube/cl5s9hhoj000414mrsifh4yn6",
    image: MapPlanetImage,
    url: `https://tiles.planet.com/basemaps/v1/planet-tiles/{name}/gmap/{z}/{x}/{y}.png?proc={proc}&api_key=${process.env.REACT_APP_PLANET_API_KEY}`
    // url: "https://globalforestwatch.org/api/planet-tiles/{name}/gmap/{z}/{x}/{y}/?proc="
  } // Look at using https://tiles.planet.com/basemaps/v1/planet-tiles/
};
