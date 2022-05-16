import { FC, HTMLAttributes, useState } from "react";
import classnames from "classnames";
import ReactMap, { MapboxEvent } from "react-map-gl";
import MapControls from "./components/ControlsContainer";
import mapboxgl from "mapbox-gl";
import labelBackgroundIcon from "assets/images/icons/MapLabelFrame.png";

interface IProps extends HTMLAttributes<HTMLElement> {}

const loadMapImage = (map: mapboxgl.Map, url: string): Promise<HTMLImageElement | ImageBitmap | undefined> => {
  return new Promise((resolve, reject) => {
    map.loadImage(url, (error, image) => {
      if (error) {
        reject(error);
      } else {
        resolve(image);
      }
    });
  });
};

const addMapLabelImage = async (map: mapboxgl.Map) => {
  const image = await loadMapImage(map, labelBackgroundIcon);

  if (image) {
    map.addImage("label-background", image, {
      // The two (blue) columns of pixels that can be stretched horizontally:
      //   - the pixels between x: 25 and x: 55 can be stretched
      //   - the pixels between x: 85 and x: 115 can be stretched.
      // @ts-ignore
      stretchX: [[3, 30]],
      // The one (red) row of pixels that can be stretched vertically:
      //   - the pixels between y: 25 and y: 100 can be stretched
      stretchY: [[3, 30]],
      // This part of the image that can contain text ([x1, y1, x2, y2]):
      content: [5, 5, 28, 28],
      // This is a high-dpi image:
      pixelRatio: 1
    });
  }
};

const Map: FC<IProps> = props => {
  const { className, children, ...rest } = props;
  const classes = classnames("c-map", className);

  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });

  const onMapLoad = (evt: MapboxEvent) => {
    evt.target.resize();
    addMapLabelImage(evt.target);
  };

  return (
    <div className={classes} data-testid="map-container" {...rest}>
      <ReactMap
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
        onLoad={onMapLoad}
      >
        <MapControls />
        {children}
      </ReactMap>
    </div>
  );
};

export default Map;
