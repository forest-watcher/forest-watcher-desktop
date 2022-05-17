import { FC, useEffect, useMemo, useState } from "react";
import { Layer, LngLatBoundsLike, Source, useMap } from "react-map-gl";
import { polygonStyle, polygonLineStyle, polygonLineStyleHover, labelStyle } from "./styles";
import * as turf from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";

interface IProps {
  id: string;
  data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string | undefined;
  onClick?: (id: string) => void;
  label?: string;
}

const Polygon: FC<IProps> = ({ id, data, onClick, label }) => {
  const { current: map } = useMap();
  const [isHover, setIsHover] = useState(false);
  const centrePoint = useMemo(() => {
    if (!data || typeof data === "string") {
      return null;
    }

    const centre = turf.center(data as AllGeoJSON);

    if (!centre) {
      return null;
    }

    return {
      ...centre,
      properties: {
        description: label
      }
    };
  }, [data, label]);

  const bounds = useMemo(() => turf.bbox(data as AllGeoJSON), [data]);

  useEffect(() => {
    map?.on("mouseenter", id, e => {
      const { features } = e;
      if (features && features[0]?.source === id) {
        setIsHover(true);
      }
    });

    map?.on("mouseleave", id, e => {
      setIsHover(false);
    });

    map?.on("click", id, e => {
      const { features } = e;

      const zoomLevel = map.getZoom();

      if (features && features[0]?.source === id) {
        if (zoomLevel < 10) {
          map.fitBounds(bounds as LngLatBoundsLike);
        }
        onClick?.(id);
      }
    });
  }, [bounds, id, map, onClick]);

  const layerStyle = isHover ? polygonLineStyleHover : polygonLineStyle;

  return (
    <>
      <Source id={id} data={data} type="geojson">
        {/* @ts-ignore */}
        <Layer {...polygonStyle} id={id} />
      </Source>
      <Source id={id} data={data} type="geojson">
        {/* @ts-ignore */}
        <Layer {...layerStyle} id={`${id}-line`} />
      </Source>
      {centrePoint && (
        <Source id={`label-${id}`} type="geojson" data={centrePoint}>
          {/* @ts-ignore */}
          <Layer {...labelStyle} id={`label-${id}`} />
        </Source>
      )}
    </>
  );
};

export default Polygon;
