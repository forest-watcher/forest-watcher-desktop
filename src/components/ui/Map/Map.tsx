import { CSSProperties, FC, HTMLAttributes, useEffect, useState } from "react";
import classnames from "classnames";
import ReactMap, { MapboxEvent } from "react-map-gl";
import { Map as MapInstance } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapControls from "./components/ControlsContainer";
import MapEditControls from "./components/EditControls";
import { goToGeojson, setupMapImages } from "helpers/map";
import { editStyles } from "./components/layers/styles";
import { FeatureCollection } from "geojson";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { BASEMAPS } from "constants/mapbox";

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
  cooperativeGestures?: boolean;
  shouldWrapContainer?: boolean;
  uncontrolled?: boolean;
  style?: CSSProperties;
  controlsPortalDom?: HTMLElement;
  hideControls?: boolean;
  hideSearch?: boolean;
  showKeyLegend?: boolean;
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
    mapStyle = BASEMAPS.satellite.style,
    style,
    cooperativeGestures = true,
    shouldWrapContainer = true,
    uncontrolled = false,
    hideControls = false,
    hideSearch = false,
    controlsPortalDom,
    showKeyLegend = false,
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

  const handleMapLoad = async (evt: MapboxEvent) => {
    evt.target.resize();
    // wait for images to load
    await setupMapImages(evt.target);
    onMapLoad?.(evt);
    setMapRef(evt.target);
  };

  const actualViewState = setMapViewState ? mapViewState : uncontrolled ? undefined : viewState;

  const mapElement = (
    <ReactMap
      {...actualViewState}
      onMove={evt => (setMapViewState ? setMapViewState(evt.viewState) : setViewState(evt.viewState))}
      mapStyle={mapStyle}
      onLoad={handleMapLoad}
      preserveDrawingBuffer // Allows canvas.toDataURL to work
      cooperativeGestures={cooperativeGestures}
      maxZoom={20}
      style={style}
    >
      {!hideControls && (
        <MapControls portalDom={controlsPortalDom} hideSearch={hideSearch} showKeyLegend={showKeyLegend} />
      )}
      {drawRef && mapRef && <MapEditControls draw={drawRef} map={mapRef} onUpdate={onMapEdit} />}
      {children}
    </ReactMap>
  );

  return (
    <OptionalWrapper data={shouldWrapContainer} elseComponent={mapElement}>
      <div className={classes} data-testid="map-container" {...rest}>
        {mapElement}
      </div>
    </OptionalWrapper>
  );
};

export default Map;
