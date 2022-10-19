import * as turf from "@turf/turf";
import { EAlertTypes } from "constants/alerts";
import { createLayeredClusterSVG, getAlertImage } from "helpers/map";
import { Marker } from "mapbox-gl";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { AlertLayerColours, IMarkers } from "types/map";
import { pointStyle, clusterCountStyle } from "./styles";
import useGetAlertsForArea from "hooks/querys/alerts/useGetAlertsForArea";

interface IProps {
  areaId: string;
}

const MAP_SOURCE_ID = "areaAlerts";

const markers: IMarkers = {};
let markersOnScreen: IMarkers = {};

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

    map?.on("render", () => {
      // ToDo: Avoid repeated Code, see src/components/ui/Map/components/layers/SquareClusterMarkers.tsx
      const mapInstance = map.getMap();

      // Render custom cluster icons
      const newMarkers: IMarkers = {};
      const features = mapInstance.querySourceFeatures(MAP_SOURCE_ID);

      for (const feature of features) {
        // @ts-ignore
        const coords = feature.geometry.coordinates;
        const props = feature.properties;
        if (!props || !props.cluster) {
          continue;
        }

        const clusterId = props.cluster_id;
        let marker = markers[clusterId];

        const colours = [];
        if (props.viirs) {
          colours.push(AlertLayerColours.VIIRS);
        }

        if (props.default) {
          colours.push(AlertLayerColours.DEFAULT);
        }

        if (!marker) {
          const el = createLayeredClusterSVG(props, colours);

          if (el) {
            // Create a new marker
            marker = markers[clusterId] = new Marker({
              element: el
            }).setLngLat(coords);
          }
        }

        newMarkers[clusterId] = marker;

        if (!markersOnScreen[clusterId]) {
          // Add to map
          marker.addTo(mapInstance);
        }
      }

      // for every marker we've added previously, remove those that are no longer visible
      for (const toRemoveid in markersOnScreen) {
        if (!newMarkers[toRemoveid]) {
          markersOnScreen[toRemoveid].remove();
        }
      }
      markersOnScreen = newMarkers;
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
      <Source
        id={MAP_SOURCE_ID}
        data={alertFeatures}
        type="geojson"
        cluster
        clusterMaxZoom={14}
        clusterRadius={50}
        generateId
        clusterProperties={{
          default: ["+", ["case", ["!", ["==", EAlertTypes.viirs, ["get", "alertType"]]], 1, 0]],
          viirs: ["+", ["case", ["==", EAlertTypes.viirs, ["get", "alertType"]], 1, 0]]
        }}
      >
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
        <Layer {...clusterCountStyle} />
      </Source>
    </>
  );
};

export default AreaAlertsSource;
