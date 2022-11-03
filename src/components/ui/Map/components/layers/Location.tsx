import { pointStyle } from "components/ui/Map/components/layers/styles";
import { MapImages } from "helpers/map";
import { FC, useEffect, useState } from "react";
import { Layer, LngLat, Source, useMap } from "react-map-gl";
import * as turf from "@turf/turf";

export interface IProps {
  id: string;
  withinLayerId: string;
  onSelectedLocationChange?: (point?: LngLat) => void;
}

const SingleLocationLayer: FC<IProps> = props => {
  const { id, withinLayerId, onSelectedLocationChange } = props;
  const { current: map } = useMap();
  const [selectedLocationPoint, setSelectedLocationPoint] = useState<LngLat>();

  useEffect(() => {
    onSelectedLocationChange?.(selectedLocationPoint);
  }, [onSelectedLocationChange, selectedLocationPoint]);

  useEffect(() => {
    const handlePreClick = (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
      } & mapboxgl.EventData
    ) => {
      const withInFeatures = map?.queryRenderedFeatures(e.point, {
        layers: [withinLayerId]
      });

      // Find all Layers the mouse clicked on
      const allMouseFeatures = map?.queryRenderedFeatures(e.point);

      if (allMouseFeatures && withInFeatures && allMouseFeatures.length === withInFeatures.length) {
        setSelectedLocationPoint(e.lngLat);
      } else {
        setSelectedLocationPoint(undefined);
      }
    };

    map?.on("click", withinLayerId, handlePreClick);

    return () => {
      map?.off("click", withinLayerId, handlePreClick);
    };
  }, [map, withinLayerId]);

  const featureData = selectedLocationPoint
    ? turf.point([selectedLocationPoint?.lng, selectedLocationPoint?.lat], {
        icon: MapImages.routePoint
      })
    : undefined;

  return (
    <>
      {featureData && (
        <Source id={id} data={featureData} type="geojson">
          {/* @ts-ignore */}
          <Layer {...pointStyle} id={id} />
        </Source>
      )}
    </>
  );
};

export default SingleLocationLayer;
