import * as turf from "@turf/turf";
import AssignmentDetailCard from "components/ui/Map/components/cards/AssignmentDetail";
import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { linePointStyle, lineStyle } from "components/ui/Map/components/layers/styles";
import {
  useGetV3GfwAssignmentsAllOpenUserForAreaAreaId,
  useGetV3GfwRoutesTeams,
  useGetV3GfwRoutesUser
} from "generated/core/coreComponents";
import { RoutesResponse } from "generated/core/coreResponses";
import { RouteModel } from "generated/core/coreSchemas";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { FC, useCallback, useMemo, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { AssignmentLayerType, IPoint } from "types/map";

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
  const { areaId } = props;
  const { current: mapRef } = useMap();
  const userId = useGetUserId();
  // const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const { httpAuthHeader } = useAccessToken();
  const { data: teamRoutes } = useGetV3GfwRoutesTeams({
    headers: httpAuthHeader
  });
  const { data: userRoutes } = useGetV3GfwRoutesUser({
    headers: httpAuthHeader
  });

  const routes = [...(teamRoutes?.data || []), ...(userRoutes?.data || [])];

  const routesMapped = routes.map(route => {
    return turf.lineString(getRoutePoints(route), route);
  });

  const pointsMapped = routes.map(route => {
    const points = turf.points(getRoutePoints(route), route);

    points.features.forEach(point => {
      const locations = routes.find(route => route.id === point.properties.id)?.attributes?.locations || [];
      const indexOfPoint = locations.findIndex(
        loc => point.geometry.coordinates[0] === loc.longitude && point.geometry.coordinates[1] === loc.latitude
      );

      console.log({ indexOfPoint });
      const isEndPoint = indexOfPoint === 0 || indexOfPoint === locations.length - 1;

      // @ts-ignore
      point.properties.isEndPoint = isEndPoint;
    });
    return points;
  });

  console.log({ routesMapped, pointsMapped });

  // const assignmentPoints = useMemo(() => {
  //   if (!data || !data.data || !data.data.length) {
  //     return [];
  //   }

  //   const assignmentCenters: IPoint[] = [];
  //   for (let i = 0; i < data.data.length; i++) {
  //     const assignment = data.data[i];

  //     let calculatedCenter;
  //     if (assignment.attributes?.location) {
  //       // Alerts are assigned to the Assignment
  //       const pointFeatures = turf.points(
  //         // @ts-ignore
  //         assignment.attributes?.location?.map(location => {
  //           const lon = typeof location.lon === "string" ? parseFloat(location.lon) : location.lon;
  //           const lat = typeof location.lat === "string" ? parseFloat(location.lat) : location.lat;
  //           return [lon, lat];
  //         })
  //       );

  //       // Find center of all the Alerts
  //       calculatedCenter = turf.center(pointFeatures);
  //     } else if (assignment.attributes?.geostore?.geojson) {
  //       // A GeoStore location is assigned to the Assignment
  //       calculatedCenter = turf.centerOfMass(assignment.attributes?.geostore?.geojson);
  //     }

  //     if (calculatedCenter) {
  //       assignmentCenters.push({
  //         id: assignment.id!,
  //         position: [calculatedCenter.geometry.coordinates[0], calculatedCenter.geometry.coordinates[1]],
  //         type: assignment.attributes?.createdBy === userId ? AssignmentLayerType.creator : AssignmentLayerType.default
  //       });
  //     }
  //   }

  //   return assignmentCenters;
  // }, [data, userId]);

  // const handleSquareSelect = useCallback((ids: string[] | null) => {
  //   setSelectedAssignmentId(ids && ids[0] ? ids[0] : null);
  // }, []);

  return (
    <>
      {/* <SquareClusterMarkers
        id="assignments"
        pointDataType={EPointDataTypes.Assignments}
        points={assignmentPoints}
        onSelectionChange={handleSquareSelect}
        selectedSquareIds={selectedAssignmentId ? [selectedAssignmentId] : null}
        mapRef={mapRef?.getMap() || null}
        canMapDeselect
      />

      <AssignmentDetailCard
        selectedAssignment={
          selectedAssignmentId && data?.data ? data.data.find(i => i.id === selectedAssignmentId) : undefined
        }
      /> */}
      {/* {routes.forEach(route => ( */}
      {routesMapped &&
        routesMapped.forEach(route => (
          <Source key={route.properties.id} type="geojson" data={route}>
            {/* @ts-ignore TS typing error with Layer */}
            <Layer {...lineStyle} />
          </Source>
        ))}
      {/* {routesMapped && (
        <Source type="geojson" data={multiPoints}>
          {/* @ts-ignore TS typing error with Layer */}
      {/* <Layer {...linePointStyle} />
        </Source> */}
      {/* `)}` */}
      {/* ))} */}
    </>
  );
};

export default AreaRoutesSource;
