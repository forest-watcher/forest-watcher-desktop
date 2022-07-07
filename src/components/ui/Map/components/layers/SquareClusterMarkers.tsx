import { FC, useEffect, useMemo, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { pointStyle, clusterStyle, clusterCountStyle } from "./styles";
import * as turf from "@turf/turf";
import { GeoJSONSource } from "mapbox-gl";
import { MapImages } from "helpers/map";

interface IPoint {
  position: [number, number];
  id: string;
}

export interface IProps {
  id: string;
  points: IPoint[];
  onSquareSelect?: (id: string) => void;
  selectedSquareId: string | null;
}

const getImage = (point: IPoint, hoveredPoint: string | null, selectedPoint: string | null) => {
  if (point.id === selectedPoint) {
    return MapImages.reportSelected;
  }

  if (point.id === hoveredPoint) {
    return MapImages.reportHover;
  }

  return MapImages.reportDefault;
};

const SquareClusterMarkers: FC<IProps> = props => {
  const { id, points, onSquareSelect, selectedSquareId } = props;
  const { current: map } = useMap();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const featureCollection = useMemo(
    () =>
      turf.featureCollection(
        points.map(point =>
          turf.point(point.position, {
            id: point.id,
            icon: getImage(point, hoveredPoint, selectedPoint)
          })
        )
      ),
    [hoveredPoint, points, selectedPoint]
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

    map?.on("click", id, e => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [id]
      });

      const pointId = features[0]?.properties?.id;
      setSelectedPoint(pointId);
      onSquareSelect?.(pointId);
    });

    map?.on("click", `clusters-${id}`, e => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [`clusters-${id}`]
      });
      const clusterId = features[0]?.properties?.cluster_id;
      const source = map.getSource(id) as GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        map.easeTo({
          // @ts-ignore
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      });
    });
  }, [id, map, onSquareSelect]);

  useEffect(() => {
    setSelectedPoint(selectedSquareId);
  }, [selectedSquareId]);

  return (
    <>
      <Source id={id} data={featureCollection} type="geojson" cluster clusterRadius={40}>
        {/* @ts-ignore */}
        <Layer {...pointStyle} id={id} />
        {/* @ts-ignore */}
        <Layer {...clusterStyle} id={`clusters-${id}`} />
        {/* @ts-ignore */}
        <Layer {...clusterCountStyle} id={`clusters-count-${id}`} />
      </Source>
    </>
  );
};

export default SquareClusterMarkers;
