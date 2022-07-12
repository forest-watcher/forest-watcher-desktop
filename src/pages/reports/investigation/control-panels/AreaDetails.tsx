import { useHistory, useParams } from "react-router-dom";
import { FC, useCallback, useEffect, useMemo } from "react";
import { toastr } from "react-redux-toastr";
import { LngLatBoundsLike, useMap } from "react-map-gl";
import * as turf from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";
import { useAppSelector } from "hooks/useRedux";
import { TParams } from "../types";
import MapCard from "components/ui/Map/components/cards/MapCard";
import Loader from "components/ui/Loader";
import { useIntl } from "react-intl";
import ToggleGroup from "components/ui/Form/ToggleGroup";
import { useForm, useWatch } from "react-hook-form";

export enum LAYERS {
  reports = "reports"
}

export type FormValues = {
  layers?: string[];
};

interface IProps {
  onChange?: (values: FormValues) => void;
}

const AreaDetailsControlPanel: FC<IProps> = props => {
  const history = useHistory();
  const { areaId } = useParams<TParams>();
  const { onChange } = props;

  const { data: areas, loading: isLoadingAreas } = useAppSelector(state => state.areas);
  const { current: map } = useMap();
  const intl = useIntl();

  const selectedAreaGeoData = useMemo(() => areas[areaId]?.attributes.geostore.geojson, [areaId, areas]);
  const formhook = useForm<FormValues>({
    defaultValues: {
      layers: [LAYERS.reports]
    }
  });
  const { register, reset } = formhook;
  const watcher = useWatch({ control: formhook.control });

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
    reset();
    history.push("/reporting/investigation");
  }, [history, reset]);

  useEffect(() => {
    // If the areas has been fetched, and the selected Area Geo Data hasn't
    // been found then return to reporting/investigation as the areaId is invalid
    if (!selectedAreaGeoData && areaId && Object.keys(areas).length) {
      toastr.warning(intl.formatMessage({ id: "reporting.investigation.error" }), "");
      handleBackBtnClick();
    }
  }, [selectedAreaGeoData, areaId, areas, handleBackBtnClick, intl]);

  useEffect(() => {
    onChange?.(watcher);
  }, [onChange, watcher]);

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage(
        { id: "reporting.control.panel.investigation.title" },
        { area: areas[areaId]?.attributes.name }
      )}
      onBack={handleBackBtnClick}
    >
      <Loader isLoading={isLoadingAreas} />
      <form>
        <ToggleGroup
          id="layer-toggles"
          registered={register("layers")}
          formHook={formhook}
          toggleGroupProps={{
            label: intl.formatMessage({ id: "layers.name" }),
            options: [
              {
                label: intl.formatMessage({ id: "reporting.control.panel.investigation.options.completedReports" }),
                value: LAYERS.reports
              }
            ]
          }}
        />
      </form>
    </MapCard>
  );
};

export default AreaDetailsControlPanel;
