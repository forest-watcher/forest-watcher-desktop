import OptionalWrapper from "components/extensive/OptionalWrapper";
import Polygon from "components/ui/Map/components/layers/Polygon";
import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { AssignmentResponse } from "generated/core/coreResponses";
import { goToGeojson } from "helpers/map";
import { FC, useEffect, useMemo } from "react";
import { LngLatBoundsLike, useMap } from "react-map-gl";
import { IPoint } from "types/map";
import { pointStyle } from "components/ui/Map/components/layers/styles";
import * as turf from "@turf/turf";

interface IProps {
  assignment?: AssignmentResponse["data"];
}

const MapLayers: FC<IProps> = ({ assignment }) => {
  const { current: map } = useMap();

  const isAlerts = useMemo(() => {
    return Boolean(
      assignment?.attributes?.location
        ? // @ts-ignore incorrect typings
          assignment?.attributes?.location.find(location => location.alertType !== undefined)
        : false
    );
  }, [assignment?.attributes?.location]);

  const alertPoints = useMemo<IPoint[] | undefined>(() => {
    return assignment?.attributes?.location?.map((alert, index) => {
      const point: IPoint = {
        id: index.toString(),
        position: [alert.lon || 0, alert.lat || 0],
        // @ts-ignore - incorrect typing
        type: alert.alertType as EAlertTypes
      };

      return point;
    });
  }, [assignment?.attributes?.location]);

  useEffect(() => {
    if (assignment?.attributes?.geostore?.geojson && map) {
      goToGeojson(map, assignment?.attributes?.geostore?.geojson, false);
    }
  }, [assignment?.attributes?.geostore?.geojson, map]);

  useEffect(() => {
    if (map && assignment?.attributes?.location && assignment.attributes.location.length > 0) {
      const points = turf.points(assignment.attributes.location.map(alert => [alert.lon || 0, alert.lat || 0]));
      const bbox = turf.bbox(points);

      if (map && bbox.length > 0) {
        map.fitBounds(bbox as LngLatBoundsLike, { padding: 40, animate: false, maxZoom: 19 });
      }
    }
  }, [assignment?.attributes?.location, map]);

  return (
    <>
      <OptionalWrapper data={Boolean(assignment?.attributes?.geostore?.geojson)}>
        <Polygon id="alert" data={assignment?.attributes?.geostore?.geojson} />
      </OptionalWrapper>
      <OptionalWrapper data={isAlerts && Boolean(alertPoints)}>
        <SquareClusterMarkers
          id="alerts"
          pointDataType={EPointDataTypes.Alerts}
          points={alertPoints || []}
          selectedSquareIds={[]}
          pointStyle={{
            ...pointStyle,
            layout: {
              ...pointStyle.layout,
              "icon-size": ["interpolate", ["exponential", 2], ["zoom"], 14, 0.05, 21, 6.2],
              "icon-pitch-alignment": "auto",
              "icon-rotation-alignment": "map"
            }
          }}
          mapRef={map?.getMap() || null}
        />
      </OptionalWrapper>
      <OptionalWrapper data={!isAlerts && Boolean(alertPoints)}>
        <SquareClusterMarkers
          id="assignments"
          pointDataType={EPointDataTypes.Assignments}
          points={alertPoints || []}
          mapRef={map?.getMap() || null}
        />
      </OptionalWrapper>
    </>
  );
};

export default MapLayers;
