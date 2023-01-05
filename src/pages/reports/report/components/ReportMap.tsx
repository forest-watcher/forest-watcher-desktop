import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import Map from "components/ui/Map/Map";
import { AnswerResponse } from "generated/core/coreResponses";
import { getReportAlertsByName } from "helpers/reports";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";
import { useCallback, useState } from "react";

type ReportMapProps = {
  answer?: AnswerResponse["data"];
};

const ReportMap = ({ answer }: ReportMapProps) => {
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [, setSelectedPoint] = useState<mapboxgl.Point | null>(null);
  const [selectedReportIds, setSelectedReportIds] = useState<string[] | null>(null);

  const handleMapLoad = (e: MapboxEvent) => {
    setMapRef(e.target);
  };

  const handleSquareSelect = useCallback((ids: string[], point: mapboxgl.Point) => {
    setSelectedPoint(point);
    setSelectedReportIds(ids);
  }, []);

  const position: [number, number] = answer?.attributes?.clickedPosition
    ? [answer.attributes.clickedPosition[0].lon, answer.attributes.clickedPosition[0].lat]
    : [0, 0];

  return (
    <Map className="c-map--within-hero" onMapLoad={handleMapLoad} hideSearch>
      <SquareClusterMarkers
        id="answers"
        pointDataType={EPointDataTypes.Reports}
        points={[
          {
            id: answer?.id ?? "",
            type:
              getReportAlertsByName(answer?.attributes?.reportName)[0] &&
              getReportAlertsByName(answer?.attributes?.reportName)[0].id,
            position
          }
        ]}
        onSquareSelect={handleSquareSelect}
        selectedSquareIds={selectedReportIds}
        mapRef={mapRef}
        goToPoints
      />
    </Map>
  );
};

export default ReportMap;
