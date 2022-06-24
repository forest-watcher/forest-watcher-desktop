import { FC, useEffect, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { LngLatBoundsLike, useMap } from "react-map-gl";
import * as turf from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";
import { useAppSelector } from "hooks/useRedux";
import { TParams } from "../types";
import MapCard from "components/ui/Map/components/cards/MapCard";

interface IProps extends RouteComponentProps<TParams> {}

const AreaDetailsControlPanel: FC<IProps> = props => {
  const { match, history } = props;
  const { areaId } = match.params;
  const { data: areas } = useAppSelector(state => state.areas);
  const { current: map } = useMap();

  const selectedAreaGeoData = useMemo(() => areas[areaId]?.attributes.geostore.geojson, [areaId, areas]);

  const bounds = useMemo(
    () => (selectedAreaGeoData ? turf.bbox(selectedAreaGeoData as AllGeoJSON) : null),
    [selectedAreaGeoData]
  );

  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds as LngLatBoundsLike, { padding: 40 });
    }
  }, [map, bounds]);

  const handleBackBtnClick = () => {
    history.push("/reporting/investigation");
  };

  return (
    <MapCard className="c-map-control-panel" title={areas[areaId].attributes.name} onBack={handleBackBtnClick}>
      {JSON.stringify(areas[areaId])}
    </MapCard>
  );
};

export default AreaDetailsControlPanel;
