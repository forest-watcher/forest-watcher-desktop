import { RouteResponse } from "generated/core/coreResponses";
import React, { PropsWithChildren, useCallback, useState } from "react";

interface IActive {
  reportIds: string[] | null;
  assignmentId: string | null;
  selectedAlertIds: string[] | null;
  neighboringAlertIds: string[] | null;
  multipleAlertsToPick: string[] | null;
  selectedRoute: RouteResponse["data"] | null;
}

export interface IContext {
  active: IActive;
  setActive: React.Dispatch<React.SetStateAction<IActive>> | null;
  setReportIds: ((ids: string[] | null) => void) | null;
  setAssignmentId: ((id: string | null) => void) | null;
  setSelectedAlertIds: ((ids: string[] | null) => void) | null;
  setNeighboringAlertIds: ((ids: string[] | null) => void) | null;
  setMultipleAlertsToPick: ((ids: string[] | null) => void) | null;
  setSelectedRoute: ((route: RouteResponse["data"] | null) => void) | null;
}

const defaultActiveState = {
  reportIds: null,
  assignmentId: null,
  selectedAlertIds: null,
  neighboringAlertIds: null,
  multipleAlertsToPick: null,
  selectedRoute: null
};

const MapContext = React.createContext<IContext>({
  active: defaultActiveState,
  setActive: null,
  setReportIds: null,
  setAssignmentId: null,
  setSelectedAlertIds: null,
  setNeighboringAlertIds: null,
  setMultipleAlertsToPick: null,
  setSelectedRoute: null
});

export default MapContext;
export const MapProvider = ({ children }: PropsWithChildren) => {
  const [active, setActive] = useState<IActive>(defaultActiveState);

  const setActiveValue = useCallback(
    (value: string[] | string | null | RouteResponse["data"], key: keyof typeof defaultActiveState) => {
      setActive(old => {
        const newLayers = { ...old };
        // @ts-ignore typing issue with value.
        newLayers[key] = value;
        return newLayers;
      });
    },
    []
  );

  const setReportIds = useCallback(
    (ids: string[] | null) => {
      setActiveValue(ids, "reportIds");
    },
    [setActiveValue]
  );

  const setAssignmentId = useCallback(
    (id: string | null) => {
      setActiveValue(id, "assignmentId");
    },
    [setActiveValue]
  );

  const setSelectedAlertIds = useCallback(
    (ids: string[] | null) => {
      setActiveValue(ids, "selectedAlertIds");
    },
    [setActiveValue]
  );

  const setNeighboringAlertIds = useCallback(
    (ids: string[] | null) => {
      setActiveValue(ids, "neighboringAlertIds");
    },
    [setActiveValue]
  );

  const setMultipleAlertsToPick = useCallback(
    (ids: string[] | null) => {
      setActiveValue(ids, "multipleAlertsToPick");
    },
    [setActiveValue]
  );

  const setSelectedRoute = useCallback(
    (route: RouteResponse["data"] | null) => {
      setActiveValue(route, "selectedRoute");
    },
    [setActiveValue]
  );

  return (
    <MapContext.Provider
      value={{
        active,
        setActive,
        setReportIds,
        setAssignmentId,
        setSelectedAlertIds,
        setNeighboringAlertIds,
        setMultipleAlertsToPick,
        setSelectedRoute
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
