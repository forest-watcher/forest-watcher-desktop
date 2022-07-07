import { FC, useEffect, useMemo, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { pointStyle, clusterStyle, clusterCountStyle } from "./styles";
import * as turf from "@turf/turf";
import { GeoJSONSource } from "mapbox-gl";

export interface IProps {
  id: string;
  points: { position: [number, number]; label: string }[];
}

const SquareClusterMarkers: FC<IProps> = props => {
  const { id, points } = props;
  const { current: map } = useMap();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const featureCollection = useMemo(
    () =>
      turf.featureCollection(
        points.map(point =>
          turf.point(point.position, {
            label: point.label,
            icon: point.label === hoveredPoint ? "report-hover" : "report-not-selected"
          })
        )
      ),
    [hoveredPoint, points]
  );

  useEffect(() => {
    map?.on("mouseenter", id, e => {
      const { features } = e;
      if (features && features[0]?.source === id) {
        setHoveredPoint(features[0]?.properties?.label);
      }
    });

    map?.on("mouseleave", id, e => {
      setHoveredPoint(null);
    });

    map?.on("click", id, e => {});
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
  }, [id, map]);

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
