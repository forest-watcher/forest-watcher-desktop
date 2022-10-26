import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import Map from "components/ui/Map/Map";
import { Answer } from "generated/forms/formsResponses";
import { getReportAlertsByName } from "helpers/reports";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";
import { useCallback, useState } from "react";

type ReportMapProps = {
  answer?: Answer;
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

  return (
    <Map className="c-map--within-hero" onMapLoad={handleMapLoad}>
      <SquareClusterMarkers
        id="answers"
        pointDataType={EPointDataTypes.Reports}
        // @ts-ignore
        points={answer?.data.map(a => ({
          position: [a.attributes.clickedPosition[0].lon, a.attributes.clickedPosition[0].lat],
          id: a.id || "",
          alertTypes: getReportAlertsByName(a.attributes?.reportName)
        }))}
        onSquareSelect={handleSquareSelect}
        selectedSquareIds={selectedReportIds}
        mapRef={mapRef}
        goToPoints
      />
    </Map>
  );
};

export default ReportMap;
