import { Location } from "history";
import { useSelector } from "react-redux";
import { matchPath } from "react-router-dom";

interface IUseGetBackLink {
  backLink: string;
  backLinkTextKey: string;
}

export const useGetBackLink = (defaultValue: IUseGetBackLink): IUseGetBackLink => {
  let backLinkTextKey;
  const stackHistory = useSelector((store: any) => store.routeStackHistory.stackHistory as Location[]);
  const previousPath = stackHistory?.[stackHistory.length - 2]?.pathname;

  if (matchPath(previousPath, { path: "/areas" })?.isExact) {
    backLinkTextKey = "areas.back";
  } else if (matchPath(previousPath, { path: "/areas/:areaId" })?.isExact) {
    backLinkTextKey = "area.back";
  } else if (matchPath(previousPath, { path: "/reporting/investigation/:areaId" })?.isExact) {
    backLinkTextKey = "reporting.back";
  }

  if (backLinkTextKey)
    //If match found
    return {
      backLink: previousPath,
      backLinkTextKey
    };
  else {
    return defaultValue;
  }
};
