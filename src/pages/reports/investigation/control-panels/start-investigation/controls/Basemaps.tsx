import RadioCardGroup from "components/ui/Form/RadioCardGroup";
import { BASEMAPS } from "constants/mapbox";
import { fireGAEvent } from "helpers/analytics";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { MapActions } from "types/analytics";

interface IProps {
  defaultBasemap?: string;
  onComparison: (value: boolean) => void;
}

const Basemaps: FC<IProps> = ({ defaultBasemap, onComparison }) => {
  const methods = useFormContext();
  const { errors } = methods.formState;
  const intl = useIntl();
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

  useEffect(() => {
    onComparison(isComparison);

    if (isComparison) {
      // * Set default values of the comparison data if isComparison
      const beforeDefault = beforeMapPeriods[beforeMapPeriods.length - 1];
      const afterDefault = afterMapPeriods[afterMapPeriods.length - 1];
      if (!watcher.currentPlanetPeriodBefore) {
        methods.setValue(`currentPlanetPeriodBefore`, beforeDefault.value);
      }
      if (!watcher.dateBefore) {
        // @ts-ignore
        methods.setValue(`dateBefore`, [beforeDefault.metadata.startDate, beforeDefault.metadata.endDate]);
      }
      if (!watcher.currentPlanetPeriodAfter) {
        methods.setValue(`currentPlanetPeriodAfter`, afterDefault.value);
      }
      if (!watcher.dateAfter) {
        // @ts-ignore
        methods.setValue(`dateAfter`, [afterDefault.metadata.startDate, afterDefault.metadata.endDate]);
      }
    }
  }, [
    onComparison,
    isComparison,
    beforeMapPeriods,
    afterMapPeriods,
    watcher.currentPlanetPeriodBefore,
    watcher.currentPlanetPeriodAfter,
    methods,
    watcher.dateBefore,
    watcher.dateAfter
  ]);

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
    </>
  );
};

export default Basemaps;
