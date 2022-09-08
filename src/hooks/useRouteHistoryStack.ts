import { ROUTER_HISTORY_PUSH } from "modules/routeStackHistory";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

export const useRouteHistoryStack = () => {
  //this hook is meant to used once in the main routes file to keep track of routes history
  const history = useHistory<any>();
  const dispatch = useDispatch();
  const location = useLocation();
  history.listen((location, action) => dispatch({ type: `routeHistory/${action}`, payload: location }));

  useEffect(() => {
    //Add initial route into history
    dispatch({ type: ROUTER_HISTORY_PUSH, payload: location });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
