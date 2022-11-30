import RadioCardGroup from "components/ui/Form/RadioCardGroup";
import { useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useMediaQuery } from "react-responsive";
//@ts-ignore
import breakpoints from "styles/utilities/_u-breakpoints.scss";
import Timeframe from "components/ui/Timeframe";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { BASEMAPS, PLANET_BASEMAP } from "constants/mapbox";
import { fireGAEvent } from "helpers/analytics";
import { MapActions } from "types/analytics";
import ToggleGroup from "components/ui/Form/ToggleGroup";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Select from "components/ui/Form/Select";
import { useSelector } from "react-redux";
import { RootState } from "store";
import Button from "components/ui/Button/Button";
import classNames from "classnames";

interface IProps {
  defaultBasemap?: string;
  onComparison: (value: boolean) => void;
}

const Basemaps: FC<IProps> = ({ defaultBasemap, onComparison }) => {
  const methods = useFormContext();
  const { errors } = methods.formState;
  const intl = useIntl();
  const isMobile = useMediaQuery({ maxWidth: breakpoints.mobile });
  const watcher = useWatch({ control: methods.control });
  const basemaps = useSelector((state: RootState) => state.map.data);
  const [isComparison, setIsComparison] = useState(false);

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

  const getBaseMapPeriods = useCallback(
    (proc: string) => {
      const currentProc = proc === "nat" ? "" : proc || "";
      const imageType = currentProc === "cir" ? "analytic" : "visual";
      return basemaps
        .filter(bm => bm.imageType === imageType)
        .map(bm => ({
          label: bm.period,
          value: bm.name,
          metadata: bm
        }))
        .reverse();
    },
    [basemaps]
  );

  const beforeMapPeriods = useMemo(() => {
    return getBaseMapPeriods(watcher.currentPlanetImageTypeBefore);
  }, [getBaseMapPeriods, watcher.currentPlanetImageTypeBefore]);

  const afterMapPeriods = useMemo(() => {
    return getBaseMapPeriods(watcher.currentPlanetImageTypeAfter);
  }, [getBaseMapPeriods, watcher.currentPlanetImageTypeAfter]);

  const resetBeforeFields = useCallback(() => {
    methods.resetField("currentPlanetPeriodBefore", {
      defaultValue: beforeMapPeriods[beforeMapPeriods.length - 1]?.value
    });
  }, [beforeMapPeriods, methods]);

  const resetAfterFields = useCallback(() => {
    methods.resetField("currentPlanetPeriodAfter", {
      defaultValue: afterMapPeriods[afterMapPeriods.length - 1]?.value
    });
  }, [afterMapPeriods, methods]);

  useEffect(() => {
    resetBeforeFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watcher.currentPlanetImageTypeBefore]);

  useEffect(() => {
    resetAfterFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watcher.currentPlanetImageTypeAfter]);

  const handleComparison = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsComparison(prev => !prev);
  };

  useEffect(() => {
    onComparison(isComparison);
  }, [onComparison, isComparison]);

  const basemapKeys = useMemo(() => {
    if (isComparison) {
      return ["Before", "After"];
    }

    return ["Before"];
  }, [isComparison]);

  useEffect(() => {
    if (!watcher.showPlanetImagery.length) {
      setIsComparison(false);
    }
  }, [watcher.showPlanetImagery]);

  useEffect(() => {
    return () => {
      resetBeforeFields();
      resetAfterFields();
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
      {basemapKeys.map((item, index) => {
        const isAfter = item === "After";
        const isLast = index === basemapKeys.length - 1;
        const baseMapPeriods = isAfter ? afterMapPeriods : beforeMapPeriods;

        return (
          <div
            className={classNames(
              "mx-[-20px] pt-6 px-5",
              isAfter ? "bg-neutral-400/70 border-solid border-t-neutral-500 border-t-2" : "bg-neutral-400/40",
              isLast && "mb-10",
              watcher.showPlanetImagery.length ? "pb-6" : "pb-2"
            )}
            key={item}
          >
            {!isAfter && (
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
            )}

            <OptionalWrapper data={watcher.showPlanetImagery?.includes(PLANET_BASEMAP.key) && basemaps.length}>
              <div key={item} className={classNames(!isLast && "mb-6")}>
                <Select
                  id="period"
                  formHook={methods}
                  registered={methods.register(`currentPlanetPeriod${item}`)}
                  selectProps={{
                    placeholder: intl.formatMessage({ id: "maps.period" }),
                    options: baseMapPeriods,
                    label: intl.formatMessage({ id: "maps.period" }),
                    defaultValue: baseMapPeriods[baseMapPeriods.length - 1]
                  }}
                  key={watcher.currentPlanetImageType}
                  className="u-margin-bottom-20"
                  alternateLabelStyle
                />
                <OptionalWrapper data={!isMobile}>
                  <div className="u-margin-bottom-40">
                    <Timeframe
                      periods={baseMapPeriods}
                      selected={
                        watcher[`currentPlanetPeriod${item}`]
                          ? baseMapPeriods.findIndex(bmp => {
                              return bmp.value === watcher[`currentPlanetPeriod${item}`];
                            })
                          : baseMapPeriods.length - 1
                      }
                      onChange={value => {
                        methods.setValue(`date${item}`, [value.metadata.startDate, value.metadata.endDate]);
                        methods.setValue(`currentPlanetPeriod${item}`, value.value);
                      }}
                      labelGetter="metadata.label"
                      yearGetter="metadata.year"
                    />
                  </div>
                </OptionalWrapper>
                <Select
                  id="colour"
                  formHook={methods}
                  registered={methods.register(`currentPlanetImageType${item}`)}
                  selectProps={{
                    placeholder: intl.formatMessage({ id: "maps.imageType" }),
                    options: imageTypeOptions,
                    label: intl.formatMessage({ id: "maps.imageType" }),
                    defaultValue: imageTypeOptions[0]
                  }}
                  alternateLabelStyle
                />
                {isLast && (
                  <Button variant="secondary" className="w-full bg-neutral-300 mt-6" onClick={e => handleComparison(e)}>
                    <FormattedMessage id={isComparison ? "maps.removeComparison" : "maps.addComparison"} />
                  </Button>
                )}
              </div>
            </OptionalWrapper>
          </div>
        );
      })}
    </>
  );
};

export default Basemaps;
