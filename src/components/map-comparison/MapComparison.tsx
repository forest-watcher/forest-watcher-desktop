import classNames from "classnames";
import { Map } from "mapbox-gl";
// @ts-ignore;
import Compare from "mapbox-gl-compare";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import { ReactNode, useState, useMemo, useEffect, useCallback } from "react";

interface IProps {
  className?: string;
  renderBefore?: (cb: React.Dispatch<React.SetStateAction<Map | null>>) => ReactNode;
  renderAfter?: (cb: React.Dispatch<React.SetStateAction<Map | null>>) => ReactNode;
  minLeftSlide?: number;
}

interface MapCompare {
  currentPosition: number; // Get Current position - this will return the slider's current position, in pixels
  setSlider: (x: number) => void; // Set Position - this will set the slider at the specified (x) number of pixels from the left-edge or top-edge of viewport based on swiper orientation
  on: (type: string, fn: (event: any) => void) => MapCompare; // Listen to an event (e.g. slideend)
  off: (type: string, fn: (event: any) => void) => MapCompare; // Turn off listening to an event (e.g. slideend)
  fire: (type: string, data: any) => MapCompare; // Fire an event
  remove: () => void; // Remove - this will remove the compare control from the DOM and stop synchronizing the two maps.
  _onMove: (e: any) => void;
  _backUpMove: (e: any) => void;
}

const MapComparison = (props: IProps) => {
  const { renderBefore, renderAfter, className, minLeftSlide = 0 } = props;
  const [beforeMapRef, setBeforeMapRef] = useState<null | Map>(null);
  const [afterMapRef, setAfterMapRef] = useState<null | Map>(null);
  const [compareMapRef, setCompareMapRef] = useState<null | MapCompare>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!compareMapRef && afterMapRef && beforeMapRef) {
      // Set clip on after. To full (so it doesn't cover up orginal before map)
      // const afterMapEl = afterMapRef.getContainer();
      // afterMapEl.style.opacity = "0";

      setCompareMapRef(
        new Compare(beforeMapRef, afterMapRef, "#map-container", {
          // Set this to enable comparing two maps by mouse movement:
          // mousemove: true
        })
      );

      // Set the original position so both maps match
      const bounds = beforeMapRef.getBounds();
      afterMapRef.fitBounds(bounds, { animate: false });

      setIsReady(true);
    }

    if (compareMapRef && (!afterMapRef || !beforeMapRef)) {
      compareMapRef.remove();
      setCompareMapRef(null);
    }
  }, [afterMapRef, beforeMapRef, compareMapRef]);

  const updatePosition = useCallback(
    (currentPosition: number) => {
      if (compareMapRef && currentPosition < minLeftSlide) {
        compareMapRef?.setSlider(minLeftSlide);
      }
    },
    [compareMapRef, minLeftSlide]
  );

  useEffect(() => {
    const onSlide = (e: { currentPosition: number }) => {
      updatePosition(e.currentPosition);
    };

    if (compareMapRef) {
      compareMapRef._backUpMove = compareMapRef._onMove;
      compareMapRef._onMove = e => {
        compareMapRef._backUpMove(e);
        compareMapRef.fire("slide", { currentPosition: compareMapRef.currentPosition });
      };

      compareMapRef.on("slide", onSlide);

      return () => {
        compareMapRef.off("slide", onSlide);
        compareMapRef._onMove = compareMapRef._backUpMove;
      };
    }
  }, [compareMapRef, minLeftSlide, updatePosition]);

  // When min left slide changes and the slider is less than current position.
  useEffect(() => {
    updatePosition(compareMapRef?.currentPosition || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minLeftSlide, updatePosition]);

  const beforeMap = useMemo(() => {
    if (renderBefore) {
      return renderBefore(setBeforeMapRef);
    } else {
      setBeforeMapRef(null);
    }

    return null;
  }, [renderBefore]);

  const afterMap = useMemo(() => {
    if (renderAfter) {
      return renderAfter(setAfterMapRef);
    } else {
      setAfterMapRef(null);
      setIsReady(false);
    }

    return null;
  }, [renderAfter]);

  return (
    <>
      <div id="map-container" className={classNames(className, "relative min-h-[500px] c-map-comparison c-map")}>
        <div>{beforeMap}</div>
        <div className={classNames(!isReady && "opacity-0")}>{afterMap}</div>
      </div>
    </>
  );
};

export default MapComparison;
