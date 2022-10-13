import * as turf from "@turf/turf";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { TAreasResponse } from "services/area";
import useGetAlertsForArea from "hooks/querys/alerts/useGetAlertsForArea";

interface IProps {
  areaId: string;
}

const alertLayerStyle = {
  id: "clusters",
  type: "circle",
  source: "alerts",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#FF6799",
    "circle-radius": 16
  }
};

const alertPointLayerStyle = {
  id: "unclustered-point",
  type: "symbol",
  paint: {
    "icon-color": "#FF6799",
    "icon-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0, 1]
  },
  source: "alerts",
  filter: ["!", ["has", "point_count"]]
};

const alertPointText = {
  id: "cluster-count",
  type: "symbol",
  source: "alerts",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    // "text-color": "#fff",
    "text-size": 12
  }
};

const UserAlertsMap: FC<IProps> = props => {
  const { areaId } = props;
  const { current: map } = useMap();
  const [alertHoverId, setAlertHoverId] = useState<number | string | undefined>(undefined);
  const { data: alerts } = useGetAlertsForArea(areaId);

  useEffect(() => {
    map?.on("mouseenter", "unclustered-point", e => {
      console.log(e);
      if (e.features && e.features.length && e.features[0].id) {
        map.setFeatureState(
          {
            source: "alerts",
            id: e.features[0].id
          },
          {
            hover: true
          }
        );

        setAlertHoverId(e.features[0].id);
      }
    });

    map?.on("mouseleave", "unclustered-point", e => {
      if (alertHoverId) {
        map.setFeatureState(
          {
            source: "alerts",
            id: alertHoverId
          },
          {
            hover: false
          }
        );

        setAlertHoverId(undefined);
      }
    });
  }, [map]);

  const alertFeatures = useMemo(() => {
    const alertPoints = [];
    for (const alertType in alerts) {
      for (let i = 0; i < alerts[alertType].length; i++) {
        alertPoints.push(
          turf.point([alerts[alertType][i].longitude, alerts[alertType][i].latitude], { name: alertType })
        );
      }
    }

    return turf.featureCollection(alertPoints);
  }, [alerts]);

  return (
    <>
      <Source id="alerts" data={alertFeatures} type="geojson" cluster clusterMaxZoom={14} clusterRadius={50} generateId>
        {/* @ts-ignore */}
        <Layer {...alertLayerStyle} />
        {/* @ts-ignore */}
        <Layer {...alertPointLayerStyle} />
        {/* @ts-ignore */}
        <Layer {...alertPointText} />
      </Source>
    </>
  );
};

export default UserAlertsMap;
