import * as turf from "@turf/turf";
import MapCard from "components/ui/Map/components/cards/MapCard";
import { linePointStyle, lineStyle } from "components/ui/Map/components/layers/styles";
import { useGetV3GfwRoutesTeams, useGetV3GfwRoutesUser } from "generated/core/coreComponents";
import { RouteResponse } from "generated/core/coreResponses";
import { RouteModel } from "generated/core/coreSchemas";
import { capitalizeFirstLetter } from "helpers/string";
import { useAccessToken } from "hooks/useAccessToken";
import { EventData, MapMouseEvent } from "mapbox-gl";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Layer, Source, useMap } from "react-map-gl";

export interface IProps {
  areaId?: string;
}

interface CardProps {
  route: RouteResponse["data"];
}

const getRoutePoints = (route: { id?: string; type?: string; attributes?: RouteModel }) => {
  const start = [route.attributes?.destination?.longitude || 0, route.attributes?.destination?.latitude || 0];

  const otherPoints =
    route.attributes?.locations?.map(location => [location.longitude || 0, location.latitude || 0]) || [];

  return [start, ...otherPoints];
};

const RouteCard: FC<CardProps> = ({ route }) => {
  const intl = useIntl();

  if (!route) {
    return null;
  }

  const routePoints = getRoutePoints(route);
  const line = turf.lineString(routePoints);
  const start = routePoints[0];
  const end = routePoints[routePoints.length - 1];
  const length = turf.length(line, { units: "kilometers" }).toFixed(1);

  return (
    <MapCard title={route.attributes?.name || ""} position="bottom-right">
      <ul className="c-card__text c-card__list">
        <li>
          <FormattedMessage
            id="route.start"
            values={{
              value: `${start[0]?.toFixed(4)}, ${start[1].toFixed(4)}`
            }}
          />
        </li>
        <li>
          <FormattedMessage
            id="route.end"
            values={{
              value: `${end[0].toFixed(4)}, ${end[1].toFixed(4)}`
            }}
          />
        </li>
        <li>
          <FormattedMessage id="route.distance" values={{ value: length }} />
        </li>
        <li>
          <FormattedMessage
            id="route.date"
            values={{
              value: intl.formatDate(route.attributes?.startDate, { month: "short", day: "2-digit", year: "numeric" })
            }}
          />
        </li>
        <li>
          <FormattedMessage
            id="route.difficulty"
            values={{ value: intl.formatMessage({ id: `route.difficulty.${route.attributes?.difficulty}` }) }}
          />
        </li>
        <li>
          <FormattedMessage
            id="route.timeTaken"
            values={{
              value: capitalizeFirstLetter(
                moment.duration(moment(route.attributes?.endDate).diff(moment(route.attributes?.startDate))).humanize()
              )
            }}
          />
        </li>
        <li>
          <FormattedMessage id="route.monitor" values={{ value: route.attributes?.createdBy }} />
        </li>
      </ul>
    </MapCard>
  );
};

const AreaRoutesSource: FC<IProps> = props => {
  const [selectedRoute, setSelectedRoute] = useState<RouteResponse["data"] | null>(null);
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
    const handleMapClick = (e: MapMouseEvent & EventData) => {
      const route = JSON.parse(e.features[0].properties.route);
      setSelectedRoute(route);
    };

    routesMapped.forEach((routes, index) => mapRef?.on("click", `route-lines-${index}`, handleMapClick));
    pointsMapped.forEach((points, index) => mapRef?.on("click", `route-points-${index}`, handleMapClick));

    return () => {
      routesMapped.forEach((routes, index) => mapRef?.off("click", `route-lines-${index}`, handleMapClick));
      pointsMapped.forEach((points, index) => mapRef?.off("click", `route-points-${index}`, handleMapClick));
    };
  }, [mapRef, pointsMapped, routesMapped]);

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
