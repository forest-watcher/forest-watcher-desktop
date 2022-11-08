import classNames from "classnames";
import { Map } from "mapbox-gl";
// @ts-ignore;
import Compare from "mapbox-gl-compare";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import { ReactNode, useState, useMemo, useEffect } from "react";

interface IProps {
  className?: string;
  renderBefore: (cb: React.Dispatch<React.SetStateAction<Map | null>>) => ReactNode;
  renderAfter: (cb: React.Dispatch<React.SetStateAction<Map | null>>) => ReactNode;
}

const MapComparison = (props: IProps) => {
  const { renderBefore, renderAfter, className } = props;
  const [beforeMapRef, setBeforeMapRef] = useState<null | Map>(null);
  const [afterMapRef, setAfterMapRef] = useState<null | Map>(null);

  useEffect(() => {
    if (afterMapRef && beforeMapRef) {
      new Compare(beforeMapRef, afterMapRef, "#map-container", {
        // Set this to enable comparing two maps by mouse movement:
        // mousemove: true
      });
    }
  }, [afterMapRef, beforeMapRef]);

  const beforeMap = useMemo(() => {
    return renderBefore(setBeforeMapRef);
  }, [renderBefore]);

  const afterMap = useMemo(() => {
    return renderAfter(setAfterMapRef);
  }, [renderAfter]);

  return (
    <div id="map-container" className={classNames(className, "relative min-h-[500px] c-map-comparison")}>
      {beforeMap}
      {afterMap}
    </div>
  );
};

export default MapComparison;
