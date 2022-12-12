import * as turf from "@turf/turf";
import { linePointStyle, lineStyle } from "components/ui/Map/components/layers/styles";
import { useGetV3GfwRoutesTeams, useGetV3GfwRoutesUser } from "generated/core/coreComponents";
import { RouteResponse } from "generated/core/coreResponses";
import { RouteModel } from "generated/core/coreSchemas";
import { useAccessToken } from "hooks/useAccessToken";
import { EventData, MapMouseEvent } from "mapbox-gl";
import { FC, useEffect, useMemo, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import RouteCard from "./RouteCard";

export interface IProps {
  areaId?: string;
}

export const getRoutePoints = (route: { id?: string; type?: string; attributes?: RouteModel }) => {
  const start = [route.attributes?.destination?.longitude || 0, route.attributes?.destination?.latitude || 0];

  const otherPoints =
    route.attributes?.locations?.map(location => [location.longitude || 0, location.latitude || 0]) || [];

  return [start, ...otherPoints];
};

const AreaRoutesSource: FC<IProps> = props => {
  const [selectedRoute, setSelectedRoute] = useState<RouteResponse["data"] | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const { httpAuthHeader } = useAccessToken();
  const { current: mapRef } = useMap();
  const { data: teamRoutes } = useGetV3GfwRoutesTeams({
    headers: httpAuthHeader
  });
  const { data: userRoutes } = useGetV3GfwRoutesUser({
    headers: httpAuthHeader
  });

  const routes = useMemo(
    () =>
      [...(teamRoutes?.data || []), ...(userRoutes?.data || [])].filter(
        route => route.attributes?.areaId === props.areaId
      ),
    [props.areaId, teamRoutes?.data, userRoutes?.data]
  );

  const routesMapped = useMemo(
    () =>
      routes.map(route => {
        const geojson = turf.lineString(getRoutePoints(route));
        // @ts-ignore
        geojson.properties.route = route;
        return geojson;
      }),
    [routes]
  );

  const pointsMapped = useMemo(
    () =>
      routes.map(route => {
        const points = turf.points(getRoutePoints(route));

        const newFeatures = points.features.map(point => {
          const newPoint = { ...point };
          const locations = [route.attributes?.destination, ...(route.attributes?.locations || [])];
          const indexOfPoint = locations.findIndex(
            loc =>
              newPoint.geometry.coordinates[0] === loc?.longitude && newPoint.geometry.coordinates[1] === loc?.latitude
          );

          // @ts-ignore
          newPoint.properties.isEndPoint = indexOfPoint === 0 || indexOfPoint === locations.length - 1;
          // @ts-ignore TODO - change based on has the route been selected - will change the style.
          newPoint.properties.isSelected = selectedRoute?.id === route.id;
          // @ts-ignore
          newPoint.properties.route = route;

          return newPoint;
        });

        points.features = newFeatures;
        return points;
      }),
    [routes, selectedRoute?.id]
  );

  useEffect(() => {
    const handleRouteClick = (e: MapMouseEvent & EventData) => {
      e.preventDefault();
      const route = JSON.parse(e.features[0].properties.route);
      setSelectedRoute(route);
      setSelectedFeature(e.features[0]);
    };

    const handleMapClick = (e: MapMouseEvent & EventData) => {
      if (e.defaultPrevented === false) {
        setSelectedRoute(null);
      }
    };

    routesMapped.forEach((routes, index) => mapRef?.on("click", `route-lines-${index}`, handleRouteClick));
    pointsMapped.forEach((points, index) => mapRef?.on("click", `route-points-${index}`, handleRouteClick));

    mapRef?.on("click", handleMapClick);

    return () => {
      routesMapped.forEach((routes, index) => mapRef?.off("click", `route-lines-${index}`, handleRouteClick));
      pointsMapped.forEach((points, index) => mapRef?.off("click", `route-points-${index}`, handleRouteClick));
      mapRef?.off("click", handleMapClick);
    };
  }, [mapRef, pointsMapped, routesMapped, selectedFeature]);

  return (
    <>
      {routesMapped &&
        routesMapped.map((route, index) => (
          <Source key={index} type="geojson" data={route}>
            {/* @ts-ignore TS typing error with Layer */}
            <Layer {...lineStyle} id={`route-lines-${index}`} />
          </Source>
        ))}

      {pointsMapped &&
        pointsMapped.map((point, index) => (
          <Source type="geojson" data={point} key={index}>
            {/* @ts-ignore TS typing error with Layer */}
            <Layer {...linePointStyle} id={`route-points-${index}`} />
          </Source>
        ))}
      {selectedRoute && <RouteCard route={selectedRoute} />}
    </>
  );
};

export default AreaRoutesSource;
