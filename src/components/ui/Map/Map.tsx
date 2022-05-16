import { FC, HTMLAttributes, useState } from "react";
import classnames from "classnames";
import ReactMap, { MapboxEvent } from "react-map-gl";
import MapControls from "./components/ControlsContainer";
import mapboxgl from "mapbox-gl";
import labelBackgroundIcon from "assets/images/icons/MapLabelFrame.png";

export interface IMapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface IProps extends HTMLAttributes<HTMLElement> {
  mapViewState?: IMapViewState;
  setMapViewState?: (viewState: IMapViewState) => void;
}

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
      // The pixels that can be stretched horizontally:
      // @ts-ignore
      stretchX: [[3, 30]],
      // The row of pixels that can be stretched vertically:
      stretchY: [[3, 30]],
      // This part of the image that can contain text ([x1, y1, x2, y2]):
      content: [5, 5, 28, 28],
      pixelRatio: 1
    });
  }
};

const Map: FC<IProps> = props => {
  const {
    className,
    children,
    mapViewState = {
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    },
    setMapViewState,
    ...rest
  } = props;
  const classes = classnames("c-map", className);

  const [viewState, setViewState] = useState(mapViewState);

  const onMapLoad = (evt: MapboxEvent) => {
    evt.target.resize();
    addMapLabelImage(evt.target);
  };

  const actualViewState = setMapViewState ? mapViewState : viewState;

  return (
    <div className={classes} data-testid="map-container" {...rest}>
      <ReactMap
        {...actualViewState}
        onMove={evt => (setMapViewState ? setMapViewState(evt.viewState) : setViewState(evt.viewState))}
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
