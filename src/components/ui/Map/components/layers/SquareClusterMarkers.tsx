import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { pointStyle as defaultPointStyle } from "./styles";
import * as turf from "@turf/turf";
import { Marker } from "mapbox-gl";
import {
  alertClusterTypeColourMap,
  assignmentClusterTypeColourMap,
  clusterZoom,
  createLayeredClusterSVG,
  getAlertImage,
  getAssignmentImage,
  getReportImage,
  goToGeojson,
  reportClusterTypeColourMap,
  TClusterTypeColourMap,
  TMapIconGenerator
} from "helpers/map";
import { IMarkers, IPoint } from "types/map";
import { Map as MapInstance } from "mapbox-gl";

export enum EPointDataTypes {
  Reports,
  Alerts,
  Assignments
}

export interface IProps {
  id: string;
  pointDataType: EPointDataTypes;
  points: IPoint[];
  pointStyle?: Record<any, any>;
  onSquareSelect?: (ids: string[], point: mapboxgl.Point) => void;
  forceHoveredSquareIds?: string[] | null;
  selectedSquareIds?: string[] | null;
  mapRef: MapInstance | null;
  goToPoints?: boolean;
  canMultiSelect?: boolean;
  onSelectionOverlapped?: (ids: string[]) => void;
  // Will a click on the map, de-select the selectedIds?
  canMapDeselect?: boolean;
  onSelectionChange?: (selectedIds: string[] | null) => void;
  locked?: boolean;
}

const SquareClusterMarkers: FC<IProps> = props => {
  const {
    id,
    pointDataType = EPointDataTypes.Reports,
    points,
    onSquareSelect,
    forceHoveredSquareIds,
    selectedSquareIds,
    mapRef,
    pointStyle = defaultPointStyle,
    canMultiSelect = false,
    canMapDeselect = false,
    onSelectionChange,
    onSelectionOverlapped,
    locked = false
  } = props;
  const { current: map } = useMap();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<string[] | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const markers = useRef<IMarkers>({});
  const markersOnScreen = useRef<IMarkers>({});

  const [iconGenerator, clusterTypeColourMap] = useMemo<[TMapIconGenerator, TClusterTypeColourMap]>(() => {
    switch (pointDataType) {
      case EPointDataTypes.Assignments:
        return [getAssignmentImage, assignmentClusterTypeColourMap];
      case EPointDataTypes.Alerts:
        return [getAlertImage, alertClusterTypeColourMap];
      default:
        // EPointDataTypes.Reports
        return [getReportImage, reportClusterTypeColourMap];
    }
  }, [pointDataType]);

  const featureCollection = useMemo(
    () =>
      turf.featureCollection(
        points.map(point =>
          turf.point(point.position, {
            id: point.id,
            icon: iconGenerator(
              point.type || "",
              point.id === hoveredPoint || forceHoveredSquareIds?.includes(point.id),
              selectedPoints?.length
                ? canMultiSelect
                  ? selectedPoints.includes(point.id)
                  : point.id === selectedPoints[0]
                : false
            ),
            alertType: point.type || ""
          })
        )
      ),
    [hoveredPoint, iconGenerator, points, selectedPoints, forceHoveredSquareIds, canMultiSelect]
  );

  useEffect(() => {
    if (props.goToPoints) {
      goToGeojson(mapRef, featureCollection, true, { zoom: 5 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]);

  useEffect(() => {
    map?.on("mousemove", id, e => {
      const { features } = e;
      if (features && features[0]?.source === id) {
        setHoveredPoint(features[0]?.properties?.id);
      }
    });

    map?.on("mouseleave", id, e => {
      setHoveredPoint(null);
    });

    map?.on("render", () => {
      const mapInstance = map.getMap();
      if (!map) return;
      // Render custom cluster icons.
      const newMarkers: IMarkers = {};
      const features = mapInstance.querySourceFeatures(id);

      // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
      // and add it to the map if it's not there already
      for (const feature of features) {
        // @ts-ignore
        const coords = feature.geometry.coordinates;
        const props = feature.properties;
        if (!props || !props.cluster) {
          continue;
        }

        const clusterId = props.cluster_id;

        let marker = markers.current[clusterId];

        const colours: string[] = [];
        clusterTypeColourMap.forEach(({ prop, hex }) => {
          if (props[prop]) {
            colours.push(hex);
          }
        });

        if (!marker) {
          const el = createLayeredClusterSVG(props, colours);

          if (el) {
            // Handle cluster zoom
            el.onclick = () => clusterZoom(map, clusterId, id, coords);
            // Create a new marker
            marker = markers.current[clusterId] = new Marker({
              element: el
            }).setLngLat(coords);
          }
        }
        // If the current Lng Lat values of the marker do not match the new coords
        if (marker.getLngLat().lng !== coords[0] || marker.getLngLat().lat !== coords[1]) {
          marker.setLngLat(coords);
        }
        newMarkers[clusterId] = marker;

        if (!markersOnScreen.current[clusterId]) {
          // Add to map
          marker.addTo(mapInstance);
        }
      }
      // for every marker we've added previously, remove those that are no longer visible
      for (const toRemoveid in markersOnScreen.current) {
        if (!newMarkers[toRemoveid]) {
          markersOnScreen.current[toRemoveid].remove();
        }
      }
      markersOnScreen.current = newMarkers;
    });
  }, [clusterTypeColourMap, id, map, onSquareSelect]);

  useEffect(() => {
    const handlePreClick = () => {
      let timeId: any;

      const handleSourceMouseClick = (
        e: mapboxgl.MapMouseEvent & {
          features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
        } & mapboxgl.EventData
      ) => {
        // Cancel the de-select timeout
        clearTimeout(timeId);
        timeId = undefined;

        const features = map?.queryRenderedFeatures(e.point, {
          layers: [id]
        });

        const pointIds = features?.map(feature => feature.properties?.id) || [];

        setSelectedPoints(state => {
          if (canMultiSelect && onSelectionOverlapped && pointIds.length > 1) {
            onSelectionOverlapped(pointIds);
            return state;
          }

          if (!state) return pointIds;

          const isCurrentlySelected = state.findIndex(i => pointIds.includes(i)) !== -1 || false;

          if (isCurrentlySelected) {
            return [...state.filter(i => !pointIds.includes(i))];
          } else if (canMultiSelect) {
            return [...state, ...pointIds];
          } else {
            return pointIds;
          }
        });
        onSquareSelect?.(pointIds, e.point);
      };

      // Trigger a de-select event if a <Source id={id} /> isn't clicked within 50ms
      if (!timeId) {
        timeId = setTimeout(() => {
          timeId = undefined;

          if (canMapDeselect) setSelectedPoints([]);
        }, 50);
      }

      // The current function was evoked by a "preclick" event
      // The next event will be "click"
      // Evoke handleSourceMouseClick() if this next click is on our <Source id={id} />
      map?.once("click", id, handleSourceMouseClick);
    };

    if (!locked) {
      map?.on("preclick", handlePreClick);
    }

    return () => {
      map?.off("preclick", handlePreClick);
    };
  }, [id, map, onSquareSelect, canMultiSelect, canMapDeselect, locked, onSelectionOverlapped]);

  useEffect(() => {
    onSelectionChange?.(selectedPoints);
  }, [selectedPoints, onSelectionChange]);

  useEffect(() => {
    if (typeof selectedSquareIds !== "undefined") setSelectedPoints(selectedSquareIds);
  }, [selectedSquareIds]);

  useEffect(() => {
    if (mapRef && mapRef.isStyleLoaded() && featureCollection.features.length > 0 && !hasMoved) {
      // Move layer to the top
      mapRef.moveLayer(id);
      setHasMoved(true);
    }
  }, [id, mapRef, featureCollection, hasMoved]);

  return (
    <>
      <Source
        id={id}
        data={featureCollection}
        type="geojson"
        cluster
        clusterRadius={40}
        clusterProperties={clusterTypeColourMap.reduce(
          (acc, { prop, type, not }) => ({
            ...acc,
            [prop]: not
              ? ["+", ["case", ["!", ["==", type, ["get", "alertType"]]], 1, 0]]
              : ["+", ["case", ["==", type, ["get", "alertType"]], 1, 0]]
          }),
          {}
        )}
      >
        {/* @ts-ignore */}
        <Layer {...pointStyle} id={id} />
      </Source>
    </>
  );
};

export default SquareClusterMarkers;
