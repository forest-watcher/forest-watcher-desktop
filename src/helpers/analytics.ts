import { GAEvents } from "types/analytics";
import ReactGA from "react-ga";

export const fireGAEvent = (event: GAEvents) => {
  ReactGA.event({
    ...event,
    label: event.label || ""
  });
};
