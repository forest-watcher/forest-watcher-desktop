import { FC, useEffect, useMemo, useState } from "react";
import Map from "components/ui/Map/Map";
import { useAppSelector } from "../../hooks/useRedux";
import { TAreasResponse } from "../../services/area";
import Polygon from "../../components/ui/Map/components/layers/Polygon";
import { Map as MapInstance } from "mapbox-gl";
import * as turf from "@turf/turf";
import { goToGeojson } from "../../helpers/map";

interface IProps {}

const InvestigationPage: FC<IProps> = () => {
  const { data: areasList } = useAppSelector(state => state.areas);
  const areaMap = useMemo<TAreasResponse[]>(() => Object.values(areasList), [areasList]);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);

  const features = useMemo(() => {
    if (areaMap.length > 0) {
      const mapped = areaMap.map((area: any) => area.attributes.geostore.geojson.features).flat();
      return turf.featureCollection(mapped);
    }
    return null;
  }, [areaMap]);

  useEffect(() => {
    if (features) {
      console.log(features);
      goToGeojson(mapRef, features);
    }
  }, [features, mapRef]);

  return (
    <Map onMapLoad={e => setMapRef(e.target)}>
      {areaMap.map((area: any) => (
        <Polygon key={area.id} id={area.id} label={area.attributes.name} data={area.attributes.geostore.geojson} />
      ))}
    </Map>
  );
};

export default InvestigationPage;
