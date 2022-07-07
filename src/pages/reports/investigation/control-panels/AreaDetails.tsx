import { FC, useCallback, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";
import { RouteComponentProps } from "react-router-dom";
import { LngLatBoundsLike, useMap } from "react-map-gl";
import * as turf from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";
import { useAppSelector } from "hooks/useRedux";
import { TParams } from "../types";
import MapCard from "components/ui/Map/components/cards/MapCard";
import Loader from "components/ui/Loader";

interface IProps extends RouteComponentProps<TParams> {}

const AreaDetailsControlPanel: FC<IProps> = props => {
  const { match, history } = props;
  const { areaId } = match.params;
  const intl = useIntl();
  const { data: areas, loading: isLoadingAreas } = useAppSelector(state => state.areas);
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

  const handleBackBtnClick = useCallback(() => {
    history.push("/reporting/investigation");
  }, [history]);

  useEffect(() => {
    // If the areas has been fetched, and the selected Area Geo Data hasn't
    // been found then return to reporting/investigation as the areaId is invalid
    if (!selectedAreaGeoData && areaId && Object.keys(areas).length) {
      toastr.warning(intl.formatMessage({ id: "reporting.investigation.error" }), "");
      handleBackBtnClick();
    }
  }, [selectedAreaGeoData, areaId, areas, handleBackBtnClick, intl]);

  return (
    <MapCard className="c-map-control-panel" title={areas[areaId]?.attributes.name} onBack={handleBackBtnClick}>
      <Loader isLoading={isLoadingAreas} />
      {JSON.stringify(areas[areaId])}
    </MapCard>
  );
};

export default AreaDetailsControlPanel;
