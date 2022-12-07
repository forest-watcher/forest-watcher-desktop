import * as turf from "@turf/turf";
import { linePointStyle, lineStyle } from "components/ui/Map/components/layers/styles";
import { useGetV3GfwRoutesTeams, useGetV3GfwRoutesUser } from "generated/core/coreComponents";
import { RouteModel } from "generated/core/coreSchemas";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useMemo } from "react";
import { Layer, Source } from "react-map-gl";

export interface IProps {
  areaId?: string;
}

const getRoutePoints = (route: { id?: string; type?: string; attributes?: RouteModel }) => {
  const start = [route.attributes?.destination?.longitude || 0, route.attributes?.destination?.latitude || 0];

  const otherPoints =
    route.attributes?.locations?.map(location => [location.longitude || 0, location.latitude || 0]) || [];

  return [start, ...otherPoints];
};

const AreaRoutesSource: FC<IProps> = props => {
  const { httpAuthHeader } = useAccessToken();
  const { data: teamRoutes } = useGetV3GfwRoutesTeams({
    headers: httpAuthHeader
  });
  const { data: userRoutes } = useGetV3GfwRoutesUser({
    headers: httpAuthHeader
  });

  const routes = useMemo(
    () => [...(teamRoutes?.data || []), ...(userRoutes?.data || [])],
    [teamRoutes?.data, userRoutes?.data]
  );

  const routesMapped = useMemo(
    () =>
      routes.map(route => {
        return turf.lineString(getRoutePoints(route));
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
          newPoint.properties.isSelected = false;

          return newPoint;
        });

        points.features = newFeatures;
        return points;
      }),
    [routes]
  );

  return (
    <>
      {routesMapped &&
        routesMapped.map((route, index) => (
          <Source key={index} type="geojson" data={route}>
            {/* @ts-ignore TS typing error with Layer */}
            <Layer {...lineStyle} />
          </Source>
        ))}

      {pointsMapped &&
        pointsMapped.map((point, index) => (
          <Source type="geojson" data={point} key={index}>
            {/* @ts-ignore TS typing error with Layer */}
            <Layer {...linePointStyle} />
          </Source>
        ))}
    </>
  );
};

export default AreaRoutesSource;
