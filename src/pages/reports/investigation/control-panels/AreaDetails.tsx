import { useHistory, useParams } from "react-router-dom";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { toastr } from "react-redux-toastr";
import { AllGeoJSON } from "@turf/turf";
import { useAppSelector } from "hooks/useRedux";
import { TParams } from "../types";
import MapCard from "components/ui/Map/components/cards/MapCard";
import Loader from "components/ui/Loader";
import { useIntl } from "react-intl";
import ToggleGroup from "components/ui/Form/ToggleGroup";
import { useForm, useWatch } from "react-hook-form";
import RadioCardGroup from "components/ui/Form/RadioCardGroup";
import { BASEMAPS } from "constants/mapbox";
import Select from "components/ui/Form/Select";
import { TPropsFromRedux } from "./AreaDetailsContainer";
import Timeframe from "components/ui/Timeframe";
//@ts-ignore
import breakpoints from "styles/utilities/_u-breakpoints.scss";
import { useMediaQuery } from "react-responsive";
import useZoomToGeojson from "hooks/useZoomToArea";
import DataFilter from "components/ui/DataFilter/DataFilter";
import { TFilterFields } from "pages/reports/reports/Reports";
import useControlPanelReportFilters from "pages/reports/reports/useControlPanelReportFilters";
import { TGetAllAnswers } from "services/reports";
import useFindArea from "hooks/useFindArea";

export enum LAYERS {
  reports = "reports"
}

export type FormValues = {
  layers?: string[];
  currentMap?: string;
  currentPlanetPeriod?: string;
  currentPlanetImageType?: "nat" | "cir";
  contextualLayers?: string[];
};

interface IProps extends TPropsFromRedux {
  onChange?: (values: FormValues) => void;
  onFilterUpdate: (answers: TGetAllAnswers["data"]) => void;
  answers?: TGetAllAnswers["data"];
  defaultBasemap?: string;
}

const AreaDetailsControlPanel: FC<IProps> = props => {
  const history = useHistory();
  const { areaId } = useParams<TParams>();
  const { onChange, basemaps, answers, onFilterUpdate, layersOptions, getLayers, defaultBasemap } = props;
  const [filteredRows, setFilteredRows] = useState<any>(answers);

  useEffect(() => {
    setFilteredRows(answers);
  }, [answers]);

  const isMobile = useMediaQuery({ maxWidth: breakpoints.mobile });

  const { data: areas, areasInUsersTeams, loading: isLoadingAreas } = useAppSelector(state => state.areas);
  const { loading: isLoadingAnswers } = useAppSelector(state => state.reports);
  const area = useFindArea(areaId, areas, areasInUsersTeams);

  const selectedAreaGeoData = useMemo(() => area?.attributes.geostore.geojson, [area]);
  const intl = useIntl();

  const { filters } = useControlPanelReportFilters(answers);

  // @ts-ignore
  useZoomToGeojson(selectedAreaGeoData as AllGeoJSON);

  const formhook = useForm<FormValues>({
    defaultValues: {
      layers: [LAYERS.reports],
      currentMap: defaultBasemap
    }
  });
  const {
    register,
    reset,
    resetField,
    setValue,
    formState: { errors }
  } = formhook;
  const watcher = useWatch({ control: formhook.control });

  const mapOptions = useMemo(() => {
    const keys = Object.keys(BASEMAPS);

    return keys.map(key => {
      return {
        value: BASEMAPS[key as keyof typeof BASEMAPS].key,
        name: intl.formatMessage({ id: BASEMAPS[key as keyof typeof BASEMAPS].key }),
        className: "c-map-control-panel__grid-item",
        image: BASEMAPS[key as keyof typeof BASEMAPS].image
      };
    });
  }, [intl]);

  const imageTypeOptions = useMemo(
    () => [
      {
        value: "nat",
        label: intl.formatMessage({ id: "maps.imageType.natural" })
      },
      {
        value: "cir",
        label: intl.formatMessage({ id: "maps.imageType.cir" })
      }
    ],
    [intl]
  );

  const baseMapPeriods = useMemo(() => {
    const currentProc = watcher.currentPlanetImageType === "nat" ? "" : watcher.currentPlanetImageType || "";
    const imageType = currentProc === "cir" ? "analytic" : "visual";
    return basemaps
      .filter(bm => bm.imageType === imageType)
      .map(bm => ({
        label: bm.period,
        value: bm.name,
        metadata: bm
      }))
      .reverse();
  }, [basemaps, watcher.currentPlanetImageType]);

  const handleBackBtnClick = useCallback(() => {
    reset();
    history.push(`/reporting/investigation/${areaId}`);
  }, [history, reset, areaId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watcher]);

  useEffect(() => {
    onFilterUpdate(filteredRows);
  }, [filteredRows, onFilterUpdate]);

  useEffect(() => {
    resetField("currentPlanetPeriod", { defaultValue: baseMapPeriods[baseMapPeriods.length - 1]?.value });
  }, [resetField, baseMapPeriods]);

  useEffect(() => {
    getLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "reporting.control.panel.investigation.title" }, { area: area?.attributes.name })}
      onBack={handleBackBtnClick}
    >
      <Loader isLoading={isLoadingAreas || isLoadingAnswers} />
      <form>
        <RadioCardGroup
          className="u-margin-bottom-40"
          error={errors.currentMap}
          registered={register("currentMap")}
          formHook={formhook}
          radioGroupProps={{
            label: "maps.basemapAndPlanet",
            optionsClassName: "c-map-control-panel__grid",
            options: mapOptions,
            value: defaultBasemap
          }}
          id="map-styles"
        />
        {watcher.currentMap === BASEMAPS.planet.key && basemaps.length && (
          <div className="u-margin-bottom-40">
            <Select
              id="period"
              formHook={formhook}
              registered={register("currentPlanetPeriod")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "maps.period" }),
                options: baseMapPeriods,
                label: intl.formatMessage({ id: "maps.period" }),
                alternateLabelStyle: true,
                defaultValue: baseMapPeriods[baseMapPeriods.length - 1]
              }}
              key={watcher.currentPlanetImageType}
              className="u-margin-bottom-20"
            />
            {!isMobile && (
              <div className="u-margin-bottom-40">
                <Timeframe
                  periods={baseMapPeriods}
                  selected={baseMapPeriods.findIndex(bmp => {
                    return bmp.value === watcher.currentPlanetPeriod;
                  })}
                  onChange={value => setValue("currentPlanetPeriod", value.value)}
                  labelGetter="metadata.label"
                  yearGetter="metadata.year"
                />
              </div>
            )}
            <Select
              id="colour"
              formHook={formhook}
              registered={register("currentPlanetImageType")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "maps.imageType" }),
                options: imageTypeOptions,
                label: intl.formatMessage({ id: "maps.imageType" }),
                alternateLabelStyle: true,
                defaultValue: imageTypeOptions[0]
              }}
            />
          </div>
        )}
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
        {answers && Boolean(watcher.layers?.length) && (
          <DataFilter<TFilterFields, any>
            filters={filters}
            onFiltered={setFilteredRows}
            options={answers}
            className="c-data-filter--in-control-panel u-margin-bottom-20"
          />
        )}
        {layersOptions.length && (
          <ToggleGroup
            id="contextual-layer-toggles"
            registered={register("contextualLayers")}
            formHook={formhook}
            hideLabel
            toggleGroupProps={{
              label: intl.formatMessage({ id: "layers.contextual" }),
              options: layersOptions.map((layer: any) => ({
                label: intl.formatMessage({ id: layer.label }),
                value: layer.option
              }))
            }}
          />
        )}
      </form>
    </MapCard>
  );
};

export default AreaDetailsControlPanel;
