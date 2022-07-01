import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "hooks/useRedux";
import Polygon, { IProps as IPolygonProps } from "../ui/Map/components/layers/Polygon";
import Map, { IProps as IMapProps } from "../ui/Map/Map";
import { TAreasResponse } from "services/area";
import { Map as MapInstance, MapboxEvent } from "mapbox-gl";
import * as turf from "@turf/turf";
import { goToGeojson } from "helpers/map";

interface IProps extends IMapProps {
  // Should be a memorised function! useCallBack()
  onAreaSelect?: IPolygonProps["onClick"];
  // Should be a memorised function! useCallBack()
  onAreaDeselect?: (id: string) => void;
  focusAllAreas?: boolean;
  selectedAreaId?: string;
}

const UserAreasMap: FC<PropsWithChildren<IProps>> = props => {
  const { onAreaSelect, onAreaDeselect, onMapLoad, focusAllAreas = true, selectedAreaId, children, ...rest } = props;
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [clickState, setClickState] = useState<{ type: "map" } | { type: "area"; areaId: string } | undefined>(
    undefined
  );

  const { data: areasList } = useAppSelector(state => state.areas);
  const areaMap = useMemo<TAreasResponse[]>(() => Object.values(areasList), [areasList]);

  const features = useMemo(() => {
    if (areaMap.length > 0) {
      const mapped = areaMap.map((area: any) => area.attributes.geostore.geojson.features).flat();
      return turf.featureCollection(mapped);
    }
    return null;
  }, [areaMap]);

  useEffect(() => {
    const callback = () => {
      setClickState({ type: "map" });
    };

    mapRef?.on("preclick", callback);
    return () => {
      mapRef?.off("preclick", callback);
    };
  }, [mapRef]);

  useEffect(() => {
    if (clickState?.type === "map" && onAreaDeselect && selectedAreaId) {
      onAreaDeselect(selectedAreaId);
    }

    if (clickState?.type === "area" && onAreaSelect) {
      onAreaSelect(clickState.areaId);
    }

    if (clickState?.type === "map" || clickState?.type === "area") {
      setClickState(undefined);
    }
  }, [clickState, onAreaSelect, onAreaDeselect, selectedAreaId]);

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
          onClick={areaId => setClickState({ type: "area", areaId })}
        />
      ))}
      {children}
    </Map>
  );
};

export default UserAreasMap;
