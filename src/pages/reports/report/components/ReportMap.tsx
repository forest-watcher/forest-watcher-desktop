import { goToGeojson } from "helpers/map";
import Map from "components/ui/Map/Map";
import Polygon from "components/ui/Map/components/layers/Polygon";
import { GeoJSONSourceOptions, MapboxEvent, Map as MapInstance } from "mapbox-gl";
import { useEffect, useState } from "react";
import { Answer } from "generated/forms/formsResponses";

type ReportMapProps = {
  answer?: Answer;
};

const ReportMap = ({ answer }: ReportMapProps) => {
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);

  // @ts-expect-error
  const clickedPositions = answer?.data[0].attributes?.clickedPosition;

  const geojson: GeoJSONSourceOptions["data"] = {
    features: [
      {
        geometry: {
          // coordinates: clickedPositions.map((pos: any) => [pos.lat, pos.lon]),
          coordinates: [
            [
              [-67.432029308, 0.756605516],
              [-67.667251788, 0.677255368],
              [-67.800285043, 0.609542378],
              [-67.844369649, 0.523814376],
              [-67.753862129, 0.477340753],
              [-67.755446541, 0.330558803],
              [-67.628047174, 0.281913681],
              [-67.510643542, 0.1285474],
              [-67.3562626, 0.277135856],
              [-67.187861646, 0.195797717],
              [-66.987214661, 0.136891249],
              [-66.865079751, 0.263048034],
              [-66.985247397, 0.601722332],
              [-67.001052803, 0.81115906],
              [-67.093374914, 0.651022878],
              [-67.154957985, 0.746191729],
              [-67.275855088, 0.774138835],
              [-67.432029308, 0.756605516]
            ]
          ],
          type: "Polygon"
        },
        properties: { name: "asd", description: "" },
        type: "Feature"
      }
    ],
    type: "FeatureCollection"
  };

  const handleMapLoad = (e: MapboxEvent) => {
    setMapRef(e.target);
  };

  useEffect(() => {
    if (geojson) {
      goToGeojson(mapRef, geojson, false);
    }
  }, [geojson, mapRef]);
  return (
    <Map className="c-map--within-hero" onMapLoad={handleMapLoad}>
      <Polygon
        // @ts-expect-error
        id={answer?.data[0].id}
        label={"Test"}
        data={geojson}
      />
    </Map>
  );
};

export default ReportMap;
