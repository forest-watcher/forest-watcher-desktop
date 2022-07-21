// Adapted from https://github.com/Vizzuality/gfw/blob/46f907e6c8354377f564262ce2f47ac807bebdec/components/satellite-basemaps/planet-selectors.js
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import { format, differenceInMonths } from "date-fns";
import { IMosaic } from "services/basemap";

export interface IPlanetBasemap {
  name: string;
  period: string;
  label: string;
  year: string;
  proc: string;
  imageType: string | null;
  sortOrder: Date;
}

// ES6 provision, replace the hyphens with slashes forces UTC to be calculated from timestamp
// instead of local time
// interesting article: https://codeofmatt.com/javascript-date-parsing-changes-in-es6/
const cleanPlanetDate = (dateStr: string) => new Date(dateStr.substring(0, 10).replace(/-/g, "/"));

export const getPlanetBasemaps = (planetBasemaps: IMosaic[]) => {
  if (!planetBasemaps || isEmpty(planetBasemaps)) return null;
  return sortBy<IPlanetBasemap>(
    planetBasemaps.map(({ name, first_acquired, last_acquired }) => {
      const startDate = cleanPlanetDate(first_acquired);
      const endDate = cleanPlanetDate(last_acquired);
      const monthDiff = differenceInMonths(endDate, startDate);
      const year = format(startDate, "yyyy");

      let imageType = null;
      let proc = "";
      if (name.includes("visual")) {
        imageType = "visual";
      } else if (name.includes("analytic")) {
        imageType = "analytic";
        proc = "cir";
      }

      const period =
        monthDiff === 1
          ? `${format(startDate, "MMM yyyy")}`
          : `${format(startDate, "MMM yyyy")} - ${format(endDate, "MMM yyyy")}`;

      const label =
        monthDiff === 1 ? `${format(startDate, "MMM")}` : `${format(startDate, "MMM")}/${format(endDate, "MMM")}`;

      return {
        name,
        period,
        label,
        year,
        proc,
        imageType,
        sortOrder: new Date(startDate)
      };
    }),
    "sortOrder"
  ).reverse();
};
