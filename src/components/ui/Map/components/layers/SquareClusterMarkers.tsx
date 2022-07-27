import { FC, useEffect, useMemo, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { pointStyle, clusterCountStyle } from "./styles";
import * as turf from "@turf/turf";
import { Marker } from "mapbox-gl";
import { clusterZoom, createLayeredClusterSVG, getReportImage } from "helpers/map";
import { IMarkers, IPoint, ReportLayerColours, ReportLayers } from "types/map";
import { Map as MapInstance } from "mapbox-gl";

export interface IProps {
  id: string;
  points: IPoint[];
  onSquareSelect?: (ids: string[], point: mapboxgl.Point) => void;
  selectedSquareIds: string[] | null;
  mapRef: MapInstance | null;
}

const LAYER_EXPRESSION_FILTERS = {
  default: ["!", ["==", ReportLayers.VIIRS, ["get", "alertType"]]],
  viirs: ["==", ReportLayers.VIIRS, ["get", "alertType"]]
};

const markers: IMarkers = {};
let markersOnScreen: IMarkers = {};

const SquareClusterMarkers: FC<IProps> = props => {
  const { id, points, onSquareSelect, selectedSquareIds, mapRef } = props;
  const { current: map } = useMap();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<string[] | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const featureCollection = useMemo(
    () =>
      turf.featureCollection(
        points.map(point =>
          turf.point(point.position, {
            id: point.id,
            icon: getReportImage(point, hoveredPoint, selectedPoints?.length ? selectedPoints[0] : null),
            alertType: point.alertTypes?.length ? point.alertTypes[0].id : ""
          })
        )
      ),
    [hoveredPoint, points, selectedPoints]
  );

  useEffect(() => {
    map?.on("mouseenter", id, e => {
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

        let marker = markers[clusterId];

        const colours = [];

        if (props.viirs) {
          colours.push(ReportLayerColours.VIIRS);
        }

        if (props.default) {
          colours.push(ReportLayerColours.DEFAULT);
        }

        if (!marker) {
          const el = createLayeredClusterSVG(props, colours);

          if (el) {
            // Handle cluster zoom
            el.onclick = () => clusterZoom(map, clusterId, id, coords);
            // Create a new marker
            marker = markers[clusterId] = new Marker({
              element: el
            }).setLngLat(coords);
          }
        }
        newMarkers[clusterId] = marker;

        if (!markersOnScreen[clusterId]) {
          // Add to map
          marker.addTo(mapInstance);
        }
      }
      // for every marker we've added previously, remove those that are no longer visible
      for (const toRemoveid in markersOnScreen) {
        if (!newMarkers[toRemoveid]) {
          markersOnScreen[toRemoveid].remove();
        }
      }
      markersOnScreen = newMarkers;
    });
  }, [id, map, onSquareSelect]);

  useEffect(() => {
    const click = (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
      } & mapboxgl.EventData
    ) => {
      const features = map?.queryRenderedFeatures(e.point, {
        layers: [id]
      });

      const pointIds = features?.map(feature => feature.properties?.id) || [];

      setSelectedPoints(pointIds);
      onSquareSelect?.(pointIds, e.point);
    };

    map?.on("click", id, click);

    return () => {
      map?.off("click", id, click);
    };
  }, [id, map, onSquareSelect]);

  useEffect(() => {
    setSelectedPoints(selectedSquareIds);
  }, [selectedSquareIds]);

  useEffect(() => {
    if (mapRef && featureCollection.features.length > 0 && !hasMoved) {
      // Move layer to the top
      mapRef.moveLayer(id);
      setHasMoved(true);
      console.log(mapRef);
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
        clusterProperties={{
          default: ["+", ["case", LAYER_EXPRESSION_FILTERS.default, 1, 0]],
          viirs: ["+", ["case", LAYER_EXPRESSION_FILTERS.viirs, 1, 0]]
        }}
      >
        {/* @ts-ignore */}
        <Layer {...pointStyle} id={id} />

        {/* @ts-ignore */}
        <Layer {...clusterCountStyle} id={`clusters-count-${id}`} />
      </Source>
    </>
  );
};

export default SquareClusterMarkers;
