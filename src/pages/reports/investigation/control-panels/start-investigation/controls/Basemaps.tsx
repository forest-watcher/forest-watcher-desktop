import RadioCardGroup from "components/ui/Form/RadioCardGroup";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMediaQuery } from "react-responsive";
//@ts-ignore
import breakpoints from "styles/utilities/_u-breakpoints.scss";
import Timeframe from "components/ui/Timeframe";
import { FC, useEffect, useMemo } from "react";
import { BASEMAPS, PLANET_BASEMAP } from "constants/mapbox";
import { fireGAEvent } from "helpers/analytics";
import { MapActions } from "types/analytics";
import ToggleGroup from "components/ui/Form/ToggleGroup";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Select from "components/ui/Form/Select";
import { useSelector } from "react-redux";
import { RootState } from "store";

interface IProps {
  defaultBasemap?: string;
}

const Basemaps: FC<IProps> = ({ defaultBasemap }) => {
  const methods = useFormContext();
  const { errors } = methods.formState;
  const intl = useIntl();
  const isMobile = useMediaQuery({ maxWidth: breakpoints.mobile });
  const watcher = useWatch({ control: methods.control });
  const basemaps = useSelector((state: RootState) => state.map.data);

  const mapOptions = useMemo(() => {
    const keys = Object.keys(BASEMAPS);

    return keys.map(key => {
      return {
        value: BASEMAPS[key as keyof typeof BASEMAPS].key,
        name: intl.formatMessage({ id: BASEMAPS[key as keyof typeof BASEMAPS].key }),
        className: "c-map-control-panel__grid-item c-map-control-panel__grid-item--slim",
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

  useEffect(() => {
    return () => {
      methods.resetField("currentPlanetPeriod", { defaultValue: baseMapPeriods[baseMapPeriods.length - 1]?.value });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RadioCardGroup
        id="map-styles"
        className="u-margin-bottom-24"
        error={errors.currentMap}
        registered={methods.register("currentMap")}
        formHook={methods}
        radioGroupProps={{
          label: "maps.basemapAndPlanet",
          optionsClassName: "c-map-control-panel__grid",
          options: mapOptions,
          value: defaultBasemap
        }}
        onChange={value => {
          fireGAEvent({
            category: "Map",
            action: MapActions.Basemaps,
            label: mapOptions.find(o => o.value === value)?.name || ""
          });
        }}
      />
      <div className="u-margin-bottom-40 bg-gray-400/40 mx-[-20px] pt-6 pb-2 px-5">
        <ToggleGroup
          id="planet"
          registered={methods.register("showPlanetImagery")}
          formHook={methods}
          hideLabel
          toggleGroupProps={{
            options: [
              {
                label: intl.formatMessage({ id: "maps.planet" }),
                value: PLANET_BASEMAP.key
              }
            ]
          }}
        />

        <OptionalWrapper data={watcher.showPlanetImagery?.includes(PLANET_BASEMAP.key) && basemaps.length}>
          <div className="u-margin-bottom-40">
            <Select
              id="period"
              formHook={methods}
              registered={methods.register("currentPlanetPeriod")}
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
            <OptionalWrapper data={!isMobile}>
              <div className="u-margin-bottom-40">
                <Timeframe
                  periods={baseMapPeriods}
                  selected={baseMapPeriods.findIndex(bmp => {
                    return bmp.value === watcher.currentPlanetPeriod;
                  })}
                  onChange={value => methods.setValue("currentPlanetPeriod", value.value)}
                  labelGetter="metadata.label"
                  yearGetter="metadata.year"
                />
              </div>
            </OptionalWrapper>
            <Select
              id="colour"
              formHook={methods}
              registered={methods.register("currentPlanetImageType")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "maps.imageType" }),
                options: imageTypeOptions,
                label: intl.formatMessage({ id: "maps.imageType" }),
                alternateLabelStyle: true,
                defaultValue: imageTypeOptions[0]
              }}
            />
          </div>
        </OptionalWrapper>
      </div>
    </>
  );
};

export default Basemaps;
