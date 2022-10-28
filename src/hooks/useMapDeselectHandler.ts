import { Map as MapInstance } from "mapbox-gl";
import { useEffect, useState } from "react";

type TMapBoxClickEvent = mapboxgl.MapMouseEvent & {
  features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
} & mapboxgl.EventData;

const useMapDeselectHandler = (
  mapRef: MapInstance | null,
  sourceId: string,
  { handleSelect, handleDeselect }: { handleSelect: () => void; handleDeselect: () => void }
) => {
  const [clickState, setClickState] = useState<
    | { type: "deselect" }
    | {
        type: "select";
        event: TMapBoxClickEvent;
      }
    | undefined
  >(undefined);

  // On 'preclick' the click state is set to type "deselect"
  // This will fire before the source 'click' handler
  useEffect(() => {
    const deselectCallback = () => {
      setClickState({ type: "deselect" });
    };
    const selectCallback = (event: TMapBoxClickEvent) => {
      setClickState({ type: "select", event });
    };

    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map.event:preclick
    mapRef?.on("preclick", deselectCallback);
    mapRef?.on("click", sourceId, selectCallback);
    return () => {
      mapRef?.off("preclick", deselectCallback);
      mapRef?.off("click", sourceId, selectCallback);
    };
  }, [mapRef, sourceId]);

  useEffect(() => {
    if (clickState?.type === "deselect") {
      console.log("deselect");
      handleDeselect?.();
    }

    if (clickState?.type === "select") {
      console.log("select");
      handleSelect?.();
    }

    if (clickState?.type === "deselect" || clickState?.type === "select") {
      setClickState(undefined);
    }
  }, [clickState]);
};

export default useMapDeselectHandler;
