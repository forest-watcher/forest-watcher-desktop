import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
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
  onAreaClick?: IPolygonProps["onClick"];
  focusAllAreas?: boolean;
  selectedAreaId?: string;
  showReports?: boolean;
  answers?: TGetAllAnswers["data"];
}

const UserAreasMap: FC<PropsWithChildren<IProps>> = props => {
  const {
    onAreaClick,
    onMapLoad,
    focusAllAreas = true,
    selectedAreaId,
    children,
    showReports = false,
    answers = [],
    ...rest
  } = props;
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);

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
          onClick={onAreaClick}
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
