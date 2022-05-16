import { FC, HTMLAttributes, useState } from "react";
import classnames from "classnames";
import ReactMap, { MapboxEvent } from "react-map-gl";
import MapControls from "./components/ControlsContainer";

interface IProps extends HTMLAttributes<HTMLElement> {}

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
  };

  return (
    <div className={classes} data-testid="map-container" {...rest}>
      <ReactMap
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onLoad={onMapLoad}
      >
        <MapControls />
        {children}
      </ReactMap>
    </div>
  );
};

export default Map;
