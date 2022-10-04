import { FC, useEffect, useMemo, useState } from "react";
import { Layer, LngLatBoundsLike, Source, useMap } from "react-map-gl";
import { polygonStyle, polygonLineStyle, polygonLineStyleHover, labelStyle } from "./styles";
import * as turf from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";
import { TAreasResponse } from "services/area";
import { GeoJSONSourceOptions } from "mapbox-gl";

export interface IProps {
  id: string;
  data: GeoJSONSourceOptions["data"] | TAreasResponse["attributes"]["geostore"]["geojson"];
  onClick?: (id: string, point?: mapboxgl.Point) => void;
  label?: string;
  isSelected?: boolean;
}

const Polygon: FC<IProps> = props => {
  const { id, data, onClick, label, isSelected = false } = props;
  const { current: map } = useMap();
  const [isHover, setIsHover] = useState(false);

  const centrePoint = useMemo(() => {
    if (!data || typeof data === "string") {
      return null;
    }

    const centre = turf.centerOfMass(data as AllGeoJSON);

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
  }, [id, map]);

  useEffect(() => {
    const click = (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
      } & mapboxgl.EventData
    ) => {
      const { features } = e;
      const zoomLevel = map?.getZoom();

      if (features && features[0]?.source === id) {
        if (zoomLevel && zoomLevel < 10) {
          map?.fitBounds(bounds as LngLatBoundsLike, { padding: 40 });
        }
        onClick?.(id, e.point);
      }
    };

    map?.on("click", id, click);

    return () => {
      map?.off("click", id, click);
    };
  }, [bounds, id, map, onClick]);

  const layerStyle = (isHover || isSelected) && onClick ? polygonLineStyleHover : polygonLineStyle;

  return (
    <>
      {centrePoint && (
        <Source id={`label-${id}`} type="geojson" data={centrePoint} tolerance={0.00001}>
          {/* @ts-ignore */}
          <Layer {...labelStyle} id={`label-${id}`} />
        </Source>
      )}
      <Source id={id} data={data as GeoJSONSourceOptions["data"]} type="geojson" tolerance={0.00001}>
        {/* @ts-ignore */}
        <Layer
          {...polygonStyle}
          //@ts-ignore
          paint={{ ...polygonStyle.paint, "fill-opacity": isSelected ? 0 : polygonStyle.paint["fill-opacity"] }}
          id={id}
          beforeId={`label-${id}`}
        />
        {/* @ts-ignore */}
        <Layer {...layerStyle} id={`${id}-line`} beforeId={`label-${id}`} />
      </Source>
    </>
  );
};

export default Polygon;
