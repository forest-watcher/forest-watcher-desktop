import { AnswersResponse } from "generated/core/coreResponses";
import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "hooks/useRedux";
import Polygon, { IProps as IPolygonProps } from "../ui/Map/components/layers/Polygon";
import Map, { IProps as IMapProps } from "../ui/Map/Map";
import { TAreasResponse } from "services/area";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";
import * as turf from "@turf/turf";
import { goToGeojson } from "helpers/map";
import SquareClusterMarkers, { EPointDataTypes } from "components/ui/Map/components/layers/SquareClusterMarkers";
import { Layer, Source } from "react-map-gl";
import { PLANET_BASEMAP } from "constants/mapbox";
import { IPlanetBasemap } from "helpers/basemap";
import ReportDetailCard from "components/ui/Map/components/cards/ReportDetailContainer";
import { getReportAlertsByName } from "helpers/reports";
import { TAnswer } from "components/ui/Map/components/cards/ReportDetail";
import { ProcTypes } from "pages/reports/investigation/Investigation";

export interface IProps extends IMapProps {
  // Should be a memorised function! useCallBack()
  onAreaSelect?: IPolygonProps["onClick"];
  // Should be a memorised function! useCallBack()
  onAreaDeselect?: (id: string) => void;
  focusAllAreas?: boolean;
  selectedAreaId?: string;
  showReports?: boolean;
  answers?: AnswersResponse["data"];
  currentPlanetBasemap?: IPlanetBasemap;
  currentProc?: ProcTypes;
  showTeamAreas?: boolean;
  cooperativeGestures?: boolean;
}

const UserAreasMap: FC<PropsWithChildren<IProps>> = props => {
  const {
    onAreaSelect,
    onAreaDeselect,
    onMapLoad,
    focusAllAreas = true,
    selectedAreaId,
    children,
    showReports = true,
    answers,
    currentPlanetBasemap,
    currentProc = "",
    showTeamAreas = false,
    cooperativeGestures = true,
    ...rest
  } = props;
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [clickState, setClickState] = useState<{ type: "deselect" } | { type: "select"; areaId: string } | undefined>(
    undefined
  );

  const { data: areasList, areasInUsersTeams } = useAppSelector(state => state.areas);

  const areaMap = useMemo<TAreasResponse[]>(() => {
    if (showTeamAreas) {
      const mapped: TAreasResponse[] = areasInUsersTeams
        .map(teamAreas => {
          return teamAreas.areas.map(area => area.data as TAreasResponse);
        })
        .flat();

      return mapped.filter((value, index, self) => self.findIndex(t => t.id === value.id) === index);
    }
    return Object.values(areasList);
  }, [areasInUsersTeams, areasList, showTeamAreas]);

  const [hasLoaded, setHasLoaded] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<mapboxgl.Point | null>(null);
  const [selectedReportIds, setSelectedReportIds] = useState<string[] | null>(null);
  const features = useMemo(() => {
    if (areaMap.length > 0) {
      const mapped = areaMap.map((area: any) => area.attributes.geostore.geojson.features).flat();
      return turf.featureCollection(mapped);
    }
    return null;
  }, [areaMap]);

  const planetBasemapUrl = useMemo(() => {
    if (currentPlanetBasemap) {
      return PLANET_BASEMAP.url.replace("{name}", currentPlanetBasemap.name).replace("{proc}", currentProc);
    }
    return null;
  }, [currentPlanetBasemap, currentProc]);

  // On 'preclick' the click state is set to type "deselect"
  // This will fire before an area 'click' handler
  useEffect(() => {
    const callback = () => {
      setClickState({ type: "deselect" });
    };

    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map.event:preclick
    mapRef?.on("preclick", callback);
    return () => {
      mapRef?.off("preclick", callback);
    };
  }, [mapRef]);

  // When an area is clicked the click state is set to type "select".
  // Effectively overriding the previous 'preclick' handler.
  // So, when a click happens an assumption is made that a de-select should
  // occur unless it's overwritten immediately by an area click.
  const handleAreaClick = useCallback(
    (areaId: string, point?: mapboxgl.Point) => {
      if (areaId !== selectedAreaId) {
        setClickState({ type: "select", areaId });
      } else {
        // If the same area was clicked, do nothing
        setClickState(undefined);
        // If points within similar area, do not set reports to null
        const boundary = 20;
        const { x, y } = selectedPoint || { x: 0, y: 0 };

        const xInRange = x > (point?.x || 0) - boundary && x < (point?.x || 0) + boundary;
        const yInRange = y > (point?.y || 0) - boundary && y < (point?.y || 0) + boundary;

        if (!(xInRange && yInRange) && selectedReportIds !== null) {
          setSelectedReportIds(null);
        }
      }
    },
    [selectedAreaId, selectedPoint, selectedReportIds]
  );

  const handleSquareSelect = useCallback((ids: string[], point: mapboxgl.Point) => {
    setSelectedPoint(point);
    setSelectedReportIds(ids);
  }, []);

  useEffect(() => {
    if (clickState?.type === "deselect" && onAreaDeselect && selectedAreaId) {
      onAreaDeselect(selectedAreaId);
    }

    if (clickState?.type === "select" && onAreaSelect) {
      onAreaSelect(clickState.areaId, undefined);
    }

    if (clickState?.type === "deselect" || clickState?.type === "select") {
      setClickState(undefined);
    }

    setSelectedPoint(null);
  }, [clickState, onAreaSelect, onAreaDeselect, selectedAreaId]);

  useEffect(() => {
    if (mapRef) {
      if (!hasLoaded) {
        setTimeout(() => {
          // Delay as  hack to get markers on top
          setHasLoaded(true);
        }, 6000);
      }
    }
  }, [hasLoaded, mapRef]);

  useEffect(() => {
    if (features && focusAllAreas) {
      goToGeojson(mapRef, features);
    }
  }, [features, mapRef, focusAllAreas]);

  const handleMapLoad = (e: MapboxEvent) => {
    setMapRef(e.target);
    if (onMapLoad) onMapLoad(e);
  };

  return (
    <Map onMapLoad={handleMapLoad} cooperativeGestures={cooperativeGestures} showKeyLegend={!!selectedAreaId} {...rest}>
      {areaMap.map(area => (
        <Polygon
          key={area.id}
          id={area.id}
          label={area.attributes.name}
          data={area.attributes.geostore.geojson}
          isSelected={selectedAreaId === area.id}
          onClick={handleAreaClick}
        />
      ))}

      {hasLoaded && (
        <SquareClusterMarkers
          id="answers"
          pointDataType={EPointDataTypes.Reports}
          points={
            answers && showReports
              ? answers.map(answer => ({
                  // @ts-ignore
                  position: [answer.attributes.clickedPosition[0].lon, answer.attributes.clickedPosition[0].lat],
                  id: answer.id || "",
                  type:
                    getReportAlertsByName(answer.attributes?.reportName)[0] &&
                    getReportAlertsByName(answer.attributes?.reportName)[0].id
                }))
              : []
          }
          onSquareSelect={handleSquareSelect}
          selectedSquareIds={selectedReportIds}
          mapRef={mapRef}
        />
      )}
      {planetBasemapUrl && (
        <Source id="planet-map" type="raster" tiles={[planetBasemapUrl]} key={planetBasemapUrl}>
          <Layer id="planet-map-layer" type="raster" beforeId={selectedAreaId} />
        </Source>
      )}

      {selectedReportIds && selectedReportIds.length > 0 && (
        <ReportDetailCard
          answers={
            answers
              ?.filter(answer => selectedReportIds.findIndex(id => id === answer.id) > -1)
              .map(answer => answer) as TAnswer[]
          }
        />
      )}

      {children}
    </Map>
  );
};

export default UserAreasMap;
