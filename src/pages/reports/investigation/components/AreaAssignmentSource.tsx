import * as turf from "@turf/turf";
import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { useGetV3GfwAssignmentsAllOpenUserForAreaAreaId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { FC, useCallback, useMemo, useState } from "react";
import { useMap } from "react-map-gl";
import { AssignmentLayerType, IPoint } from "types/map";

export interface IProps {
  areaId?: string;
}

const AreaAssignmentMapSource: FC<IProps> = props => {
  const { areaId } = props;
  const { current: mapRef } = useMap();
  const userId = useGetUserId();
  const [, setSelectedPoint] = useState<mapboxgl.Point | null>(null);
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState<string[] | null>(null);

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

      // @ts-ignore
      const pointFeatures = turf.points(assignment.attributes?.location?.map(location => [location.lon, location.lat]));

      // Find center of all the Alerts
      const calculatedCenter = turf.center(pointFeatures);
      assignmentCenters.push({
        id: assignment.id!,
        position: [calculatedCenter.geometry.coordinates[0], calculatedCenter.geometry.coordinates[1]],
        type: assignment.attributes?.createdBy === userId ? AssignmentLayerType.creator : AssignmentLayerType.default
      });
    }

    return assignmentCenters;
  }, [data, userId]);

  const handleSquareSelect = useCallback((ids: string[], point: mapboxgl.Point) => {
    setSelectedPoint(point);
    setSelectedAssignmentIds(ids);
  }, []);

  return (
    <>
      <SquareClusterMarkers
        id="assignments"
        pointDataType={EPointDataTypes.Assignments}
        points={assignmentPoints}
        onSquareSelect={handleSquareSelect}
        selectedSquareIds={selectedAssignmentIds}
        mapRef={mapRef?.getMap() || null}
        canMapDeselect
      />
    </>
  );
};

export default AreaAssignmentMapSource;
