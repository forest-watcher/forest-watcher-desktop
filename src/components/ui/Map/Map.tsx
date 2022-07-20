import { FC, HTMLAttributes, useEffect, useState } from "react";
import classnames from "classnames";
import ReactMap, { MapboxEvent } from "react-map-gl";
import { Map as MapInstance } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapControls from "./components/ControlsContainer";
import MapEditControls from "./components/EditControls";
import { goToGeojson, setupMapImages } from "helpers/map";
import { editStyles } from "./components/layers/styles";
import { FeatureCollection } from "geojson";

export interface IMapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface IProps extends HTMLAttributes<HTMLElement> {
  mapViewState?: IMapViewState;
  setMapViewState?: (viewState: IMapViewState) => void;
  onMapLoad?: (e: MapboxEvent) => void;
  onDrawLoad?: (e: MapboxDraw) => void;
  onMapEdit?: (e: FeatureCollection) => void;
  geojsonToEdit?: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  mapStyle?: string;
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
    geojsonToEdit,
    onDrawLoad,
    mapStyle = "mapbox://styles/3sidedcube/cl5axl8ha002c14o5exjzmdlb",
    ...rest
  } = props;
  const classes = classnames("c-map", className);

  const [viewState, setViewState] = useState(mapViewState);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [drawRef, setDrawRef] = useState<MapboxDraw | null>(null);
  const [addedGeoJson, setAddedGeoJson] = useState(false);

  useEffect(() => {
    if (onMapEdit && mapRef && !drawRef) {
      // We are in edit mode, setup edit controls.
      const draw = new MapboxDraw({ styles: editStyles });
      setDrawRef(draw);
      mapRef.addControl(draw, "bottom-right");
      onDrawLoad?.(draw);
    }
  }, [onMapEdit, mapRef, drawRef, onDrawLoad]);

  useEffect(() => {
    if (onMapEdit && mapRef && drawRef && geojsonToEdit && !addedGeoJson) {
      // We are in edit mode, add geojson to edit
      drawRef.add(geojsonToEdit);
      setAddedGeoJson(true);
      goToGeojson(mapRef, geojsonToEdit, false);
    }
  }, [onMapEdit, mapRef, geojsonToEdit, drawRef, addedGeoJson]);

  const handleMapLoad = (evt: MapboxEvent) => {
    evt.target.resize();
    setupMapImages(evt.target);
    onMapLoad?.(evt);
    setMapRef(evt.target);
  };

  const actualViewState = setMapViewState ? mapViewState : viewState;

  return (
    <div className={classes} data-testid="map-container" {...rest}>
      <ReactMap
        {...actualViewState}
        onMove={evt => (setMapViewState ? setMapViewState(evt.viewState) : setViewState(evt.viewState))}
        mapStyle={mapStyle}
        onLoad={handleMapLoad}
        preserveDrawingBuffer // Allows canvas.toDataURL to work
      >
        <MapControls />
        {drawRef && mapRef && <MapEditControls draw={drawRef} map={mapRef} onUpdate={onMapEdit} />}
        {children}
      </ReactMap>
    </div>
  );
};

export default Map;
