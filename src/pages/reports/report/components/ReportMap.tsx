import Map from "components/ui/Map/Map";
import { MapboxEvent, Map as MapInstance } from "mapbox-gl";
import { useCallback, useState } from "react";
import { Answer } from "generated/forms/formsResponses";
import SquareClusterMarkers from "components/ui/Map/components/layers/SquareClusterMarkers";
import { getReportAlertsByName } from "helpers/reports";

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
