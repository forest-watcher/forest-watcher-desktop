import * as turf from "@turf/turf";
import { getAlertImage } from "helpers/map";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { pointStyle, clusterStyle, clusterCountStyle } from "./styles";
import useGetAlertsForArea from "hooks/querys/alerts/useGetAlertsForArea";

interface IProps {
  areaId: string;
}

const AreaAlertsSource: FC<IProps> = props => {
  const { areaId } = props;
  const { current: map } = useMap();
  const [alertHoverId, setAlertHoverId] = useState<number | string | undefined>(undefined);
  const { data: alerts } = useGetAlertsForArea(areaId);

  useEffect(() => {
    map?.on("mousemove", "unclustered-point", e => {
      if (e.features && e.features.length && e.features[0].properties?.id) {
        setAlertHoverId(e.features[0].properties?.id);
      }
    });

    map?.on("mouseleave", "unclustered-point", e => {
      setAlertHoverId(undefined);
    });
  }, [map]);

  const alertFeatures = useMemo(() => {
    const alertPoints = [];
    for (const alertType in alerts) {
      for (let i = 0; i < alerts[alertType].length; i++) {
        alertPoints.push(
          turf.point([alerts[alertType][i].longitude, alerts[alertType][i].latitude], {
            id: i,
            icon: getAlertImage(alertType, i === Number(alertHoverId)),
            alertType
          })
        );
      }
    }

    return turf.featureCollection(alertPoints);
  }, [alertHoverId, alerts]);

  return (
    <>
      <Source id="alerts" data={alertFeatures} type="geojson" cluster clusterMaxZoom={14} clusterRadius={50} generateId>
        {/* @ts-ignore */}
        <Layer
          {...{
            ...pointStyle,
            layout: {
              ...pointStyle.layout,
              "icon-size": ["interpolate", ["exponential", 2], ["zoom"], 14, 0.05, 21, 6.2],
              "icon-pitch-alignment": "auto",
              "icon-rotation-alignment": "map"
            }
          }}
          id={"unclustered-point"}
        />
        {/* @ts-ignore */}
        <Layer {...clusterStyle} />
        {/* @ts-ignore */}
        <Layer {...clusterCountStyle} />
      </Source>
    </>
  );
};

export default AreaAlertsSource;
