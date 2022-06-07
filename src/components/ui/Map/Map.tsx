import { FC, HTMLAttributes, useEffect, useState } from "react";
import classnames from "classnames";
import ReactMap, { MapboxEvent } from "react-map-gl";
import { Map as MapInstance } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapControls from "./components/ControlsContainer";
import MapEditControls from "./components/EditControls";
import { addMapLabelImage } from "helpers/map";
import { editStyles } from "./components/layers/styles";

export interface IMapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface IProps extends HTMLAttributes<HTMLElement> {
  mapViewState?: IMapViewState;
  setMapViewState?: (viewState: IMapViewState) => void;
  onMapLoad?: (e: MapboxEvent) => void;
  onMapEdit?: () => void;
  polygonToEdit?: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
}

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
    onMapLoad,
    onMapEdit,
    polygonToEdit,
    ...rest
  } = props;
  const classes = classnames("c-map", className);

  const [viewState, setViewState] = useState(mapViewState);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [drawRef, setDrawRef] = useState<MapboxDraw | null>(null);

  useEffect(() => {
    if (onMapEdit && mapRef) {
      // We are in edit mode, setup edit.
      const draw = new MapboxDraw({ styles: editStyles });
      setDrawRef(draw);
      mapRef.addControl(draw, "bottom-right");

      if (polygonToEdit) {
        draw.add(polygonToEdit);
        // draw.changeMode("simple_select", { featureIds: ids });
      }
    }
  }, [onMapEdit, mapRef, polygonToEdit]);

  const handleMapLoad = (evt: MapboxEvent) => {
    evt.target.resize();
    addMapLabelImage(evt.target);
    onMapLoad?.(evt);
    setMapRef(evt.target);
  };

  const actualViewState = setMapViewState ? mapViewState : viewState;

  return (
    <div className={classes} data-testid="map-container" {...rest}>
      <ReactMap
        {...actualViewState}
        onMove={evt => (setMapViewState ? setMapViewState(evt.viewState) : setViewState(evt.viewState))}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
        onLoad={handleMapLoad}
      >
        <MapControls />
        {drawRef && mapRef && <MapEditControls draw={drawRef} map={mapRef} />}
        {children}
      </ReactMap>
    </div>
  );
};

export default Map;
