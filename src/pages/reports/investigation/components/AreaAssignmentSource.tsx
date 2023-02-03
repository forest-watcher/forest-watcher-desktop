import * as turf from "@turf/turf";
import AssignmentDetailCard from "components/ui/Map/components/cards/AssignmentDetail";
import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { useGetV3GfwAssignmentsAllOpenUserForAreaAreaId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { FC, useCallback, useContext, useMemo } from "react";
import { useMap } from "react-map-gl";
import { AssignmentLayerType, IPoint } from "types/map";
import MapContext from "../MapContext";

export interface IProps {
  areaId?: string;
  parentControl: boolean;
}

const AreaAssignmentMapSource: FC<IProps> = props => {
  const {
    active: { assignmentId: selectedAssignmentId },
    setAssignmentId: setSelectedAssignmentId
  } = useContext(MapContext);

  const { areaId, parentControl } = props;
  const { current: mapRef } = useMap();
  const userId = useGetUserId();

  const { httpAuthHeader } = useAccessToken();
  const { data } = useGetV3GfwAssignmentsAllOpenUserForAreaAreaId(
    {
      pathParams: {
        areaId: areaId!
      },
      headers: httpAuthHeader
    },
    {
      enabled: !!areaId
    }
  );

  const assignmentPoints = useMemo(() => {
    if (!data || !data.data || !data.data.length) {
      return [];
    }

    const assignmentCenters: IPoint[] = [];
    for (let i = 0; i < data.data.length; i++) {
      const assignment = data.data[i];

      let calculatedCenter;
      if (assignment.attributes?.location) {
        // Alerts are assigned to the Assignment
        const pointFeatures = turf.points(
          // @ts-ignore
          assignment.attributes?.location?.map(location => {
            const lon = typeof location.lon === "string" ? parseFloat(location.lon) : location.lon;
            const lat = typeof location.lat === "string" ? parseFloat(location.lat) : location.lat;
            return [lon, lat];
          })
        );

        // Find center of all the Alerts
        calculatedCenter = turf.center(pointFeatures);
      } else if (assignment.attributes?.geostore?.geojson) {
        // A GeoStore location is assigned to the Assignment
        calculatedCenter = turf.centerOfMass(assignment.attributes?.geostore?.geojson);
      }

      if (calculatedCenter) {
        assignmentCenters.push({
          id: assignment.id!,
          position: [calculatedCenter.geometry.coordinates[0], calculatedCenter.geometry.coordinates[1]],
          type:
            assignment.attributes?.createdBy === userId && !assignment.attributes?.monitors.includes(userId)
              ? AssignmentLayerType.creator
              : AssignmentLayerType.default
        });
      }
    }

    return assignmentCenters;
  }, [data, userId]);

  const handleSquareSelect = useCallback(
    (ids: string[] | null) => {
      setSelectedAssignmentId?.(ids && ids[0] ? ids[0] : null);
    },
    [setSelectedAssignmentId]
  );

  return (
    <>
      <SquareClusterMarkers
        id="assignments"
        pointDataType={EPointDataTypes.Assignments}
        points={assignmentPoints}
        onSquareSelect={handleSquareSelect}
        selectedSquareIds={selectedAssignmentId ? [selectedAssignmentId] : null}
        mapRef={mapRef?.getMap() || null}
        canMapDeselect
      />

      <AssignmentDetailCard
        selectedAssignment={
          selectedAssignmentId && data?.data ? data.data.find(i => i.id === selectedAssignmentId) : undefined
        }
        onClose={() => parentControl && setSelectedAssignmentId?.(null)}
      />
    </>
  );
};

export default AreaAssignmentMapSource;
