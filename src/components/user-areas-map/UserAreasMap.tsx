import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "hooks/useRedux";
import Polygon, { IProps as IPolygonProps } from "../ui/Map/components/layers/Polygon";
import Map, { IProps as IMapProps } from "../ui/Map/Map";
import { TAreasResponse } from "services/area";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";
import * as turf from "@turf/turf";
import { goToGeojson } from "helpers/map";
import { TGetAllAnswers } from "services/reports";
import SquareClusterMarkers from "components/ui/Map/components/layers/SquareClusterMarkers";

const dummyPoints = [
  {
    position: [-1.879481, 50.715018] as [number, number],
    label: "1"
  },
  {
    position: [-1.876792, 50.715535] as [number, number],
    label: "2"
  },
  {
    position: [-1.873366, 50.71606] as [number, number],
    label: "3"
  }
];

interface IProps extends IMapProps {
  // Should be a memorised function! useCallBack()
  onAreaSelect?: IPolygonProps["onClick"];
  // Should be a memorised function! useCallBack()
  onAreaDeselect?: (id: string) => void;
  focusAllAreas?: boolean;
  selectedAreaId?: string;
  showReports?: boolean;
  answers?: TGetAllAnswers["data"];
}

const UserAreasMap: FC<PropsWithChildren<IProps>> = props => {
  const {
    onAreaSelect,
    onAreaDeselect,
    onMapLoad,
    focusAllAreas = true,
    selectedAreaId,
    children,
    showReports = false,
    answers,
    ...rest
  } = props;
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [clickState, setClickState] = useState<{ type: "deselect" } | { type: "select"; areaId: string } | undefined>(
    undefined
  );

  const { data: areasList } = useAppSelector(state => state.areas);
  const areaMap = useMemo<TAreasResponse[]>(() => Object.values(areasList), [areasList]);
  const [timeoutShowReports, setTimeoutShowReports] = useState(false);

  const features = useMemo(() => {
    if (areaMap.length > 0) {
      const mapped = areaMap.map((area: any) => area.attributes.geostore.geojson.features).flat();
      return turf.featureCollection(mapped);
    }
    return null;
  }, [areaMap]);

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
    (areaId: string) => {
      if (areaId !== selectedAreaId) {
        setClickState({ type: "select", areaId });
      } else {
        // If the same area was clicked, do nothing
        setClickState(undefined);
      }
    },
    [selectedAreaId]
  );

  useEffect(() => {
    if (clickState?.type === "deselect" && onAreaDeselect && selectedAreaId) {
      onAreaDeselect(selectedAreaId);
    }

    if (clickState?.type === "select" && onAreaSelect) {
      onAreaSelect(clickState.areaId);
    }

    if (clickState?.type === "deselect" || clickState?.type === "select") {
      setClickState(undefined);
    }
  }, [clickState, onAreaSelect, onAreaDeselect, selectedAreaId]);

  useEffect(() => {
    if (mapRef) {
      setTimeout(() => {
        // Delay as  hack to get markers on top
        setTimeoutShowReports(showReports);
      }, 5000);
    }
  }, [mapRef, showReports]);

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
    <Map onMapLoad={handleMapLoad} {...rest}>
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

      {timeoutShowReports && (
        <SquareClusterMarkers
          id="answers"
          points={dummyPoints}
          // answers
          //   .filter(answer => answer.attributes?.areaOfInterest === selectedAreaId)
          //   .map(answer => ({
          //     // @ts-ignore
          //     position: [answer.attributes?.clickedPosition[0].lon, answer.attributes?.clickedPosition[0].lat],
          //     label: "hey"
          //   }))}
        />
      )}

      {children}
    </Map>
  );
};

export default UserAreasMap;
