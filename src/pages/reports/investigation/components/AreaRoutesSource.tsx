import * as turf from "@turf/turf";
import { linePointStyle, lineStyle } from "components/ui/Map/components/layers/styles";
import { useGetV3GfwRoutesTeams, useGetV3GfwRoutesUser } from "generated/core/coreComponents";
import { RouteModel } from "generated/core/coreSchemas";
import { useAccessToken } from "hooks/useAccessToken";
import { EventData, MapMouseEvent } from "mapbox-gl";
import { FC, useContext, useEffect, useMemo } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import MapContext from "../MapContext";
import RouteCard from "./RouteCard";

export interface IProps {
  areaId?: string;
  parentControl?: boolean;
}

export const getRoutePoints = (route: { id?: string; type?: string; attributes?: RouteModel }) => {
  return route.attributes?.locations?.map(location => [location.longitude || 0, location.latitude || 0]) || [];
};

const AreaRoutesSource: FC<IProps> = props => {
  const {
    active: { selectedRoute },
    setSelectedRoute
  } = useContext(MapContext);
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

  const routesMapped = useMemo(() => {
    const mapped = routes.map(route => {
      const points = getRoutePoints(route);

      if (points.length <= 1) {
        return null;
      }

      const geojson = turf.lineString(getRoutePoints(route));
      // @ts-ignore
      geojson.properties.route = route;
      return geojson;
    });

    const filtered = mapped.filter(route => route !== null) as turf.helpers.Feature<
      turf.helpers.LineString,
      turf.helpers.Properties
    >[];

    return filtered;
  }, [routes]);

  const pointsMapped = useMemo(() => {
    const mapped = routes.map(route => {
      const points = getRoutePoints(route);

      if (points.length <= 1) {
        return null;
      }

      const formattedPoints = turf.points(getRoutePoints(route));

      const newFeatures = formattedPoints.features.map(point => {
        const newPoint = { ...point };
        const locations = route.attributes?.locations || [];
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

      formattedPoints.features = newFeatures;
      return formattedPoints;
    });

    const filtered = mapped.filter(route => route !== null) as turf.helpers.FeatureCollection<
      turf.helpers.Point,
      turf.helpers.Properties
    >[];

    return filtered;
  }, [routes, selectedRoute?.id]);

  useEffect(() => {
    const handleRouteClick = (e: MapMouseEvent & EventData) => {
      e.preventDefault();
      const route = JSON.parse(e.features[0].properties.route);
      setSelectedRoute?.(route);
    };

    routesMapped.forEach((routes, index) => mapRef?.on("click", `route-lines-${index}`, handleRouteClick));
    pointsMapped.forEach((points, index) => mapRef?.on("click", `route-points-${index}`, handleRouteClick));

    return () => {
      routesMapped.forEach((routes, index) => mapRef?.off("click", `route-lines-${index}`, handleRouteClick));
      pointsMapped.forEach((points, index) => mapRef?.off("click", `route-points-${index}`, handleRouteClick));
    };
  }, [mapRef, pointsMapped, routesMapped, setSelectedRoute]);

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
      {selectedRoute && (
        <RouteCard route={selectedRoute} onClose={() => props.parentControl && setSelectedRoute?.(null)} />
      )}
    </>
  );
};

export default AreaRoutesSource;
