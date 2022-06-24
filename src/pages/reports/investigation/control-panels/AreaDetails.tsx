import { FC, useEffect, useMemo } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { LngLatBoundsLike, useMap } from "react-map-gl";
import * as turf from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";
import { useAppSelector } from "hooks/useRedux";
import { TParams } from "../types";

interface IProps extends RouteComponentProps<TParams> {}

const AreaDetailsControlPanel: FC<IProps> = props => {
  const { match } = props;
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

  return (
    <div className="c-map-control-panel">
      {Object.values<any>(areas).map(area => (
        <Link to={`/reporting/investigation/${area.id}`} className="c-button c-button--primary">
          {area.attributes.name}
        </Link>
      ))}
    </div>
  );
};

export default AreaDetailsControlPanel;
