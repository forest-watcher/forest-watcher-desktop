import { EAlertTypes } from "constants/alerts";
import KDBush from "kdbush";
import geoKDBush from "geokdbush";
import { Map as MapInstance, LngLatBoundsLike, GeoJSONSource } from "mapbox-gl";
import labelBackgroundIcon from "assets/images/icons/MapLabelFrame.png";
import reportNotSelectedIcon from "assets/images/icons/alertIcons/ReportNotSelected.png";
import reportHoverIcon from "assets/images/icons/alertIcons/ReportHover.png";
import reportSelectedIcon from "assets/images/icons/alertIcons/ReportSelected.png";
import reportLargerSelectedIcon from "assets/images/icons/alertIcons/ReportLargerSelected.png";
import reportViirsNotSelectedIcon from "assets/images/icons/alertIcons/ReportViirsDefault.png";
import reportViirsHoverIcon from "assets/images/icons/alertIcons/ReportViirsHover.png";
import alertNotSelectedIcon from "assets/images/icons/alertIcons/AlertNotSelected.png";
import alertHoverIcon from "assets/images/icons/alertIcons/AlertHover.png";
import alertLargerNotSelectedIcon from "assets/images/icons/alertIcons/AlertLargerNotSelected.png";
import alertLargerHoverIcon from "assets/images/icons/alertIcons/AlertLargerHover.png";
import alertViirsNotSelectedIcon from "assets/images/icons/alertIcons/AlertViirsNotSelected.png";
import alerViirsHoverIcon from "assets/images/icons/alertIcons/AlertViirsHover.png";
import assignmentAssignedToMeIcon from "assets/images/icons/alertIcons/AssignmentAssignedToMe.png";
import assignmentCreateByMeIcon from "assets/images/icons/alertIcons/AssignmentCreatedByMe.png";
import assignmentAssignedToMeHoverIcon from "assets/images/icons/alertIcons/AssignmentAssignedToMeHover.png";
import assignmentCreateByMeHoverIcon from "assets/images/icons/alertIcons/AssignmentCreatedByMeHover.png";
import assignmentSelectedIcon from "assets/images/icons/alertIcons/AssignmentSelected.png";
import routePointIcon from "assets/images/icons/routeIcons/RoutePoint.png";
import routePointIconSelected from "assets/images/icons/routeIcons/RoutePointSelected.png";
import routePointIconUnselected from "assets/images/icons/routeIcons/RoutePointUnselected.png";
import routePointIconMiddle from "assets/images/icons/routeIcons/RoutePointMiddle.png";
import blankIcon from "assets/images/icons/routeIcons/Blank.png";

import L from "leaflet";
import * as turf from "@turf/turf";
import { GeoJsonProperties } from "geojson";
import { MapRef } from "react-map-gl";
import { AlertLayerColours, AssignmentLayerColours, ReportLayerColours, ReportLayers, TAlertsById } from "types/map";

export enum MapImages {
  label = "label",
  reportDefault = "report-default",
  reportHover = "report-hover",
  reportSelected = "report-selected",
  reportLargerSelected = "report-larger-selected",
  reportViirsHover = "report-viirs-hover",
  reportViirsDefault = "report-viirs-default",
  alertDefault = "alert-default",
  alertLargeDefault = "alert-large-default",
  alertHover = "alert-hover",
  alertLargeHover = "alert-large-hover",
  alertViirsDefault = "alert-viirs-default",
  alertViirsHover = "alert-viirs-hover",
  assignmentAssignedToMe = "assignment-assigned-to-me",
  assignmentCreatedByMe = "assignment-created-by-me",
  assignmentAssignedToMeHover = "assignment-assigned-to-me-hover",
  assignmentCreatedByMeHover = "assignment-created-by-me-hover",
  assignmentSelected = "assignment-selected",
  routePoint = "route-point",
  routePointSelected = "route-point-selected",
  routePointIconUnselected = "route-point-unselected",
  routePointIconMiddle = "route-point-middle",
  blank = "blank"
}

export const mapImagesArr = [
  {
    type: MapImages.label,
    image: labelBackgroundIcon,
    options: {
      // The pixels that can be stretched horizontally:
      // @ts-ignore
      stretchX: [[3, 30]],
      // The row of pixels that can be stretched vertically:
      stretchY: [[3, 30]],
      // This part of the image that can contain text ([x1, y1, x2, y2]):
      content: [5, 5, 28, 28],
      pixelRatio: 1
    }
  },
  {
    type: MapImages.reportDefault,
    image: reportNotSelectedIcon
  },
  {
    type: MapImages.reportHover,
    image: reportHoverIcon
  },
  {
    type: MapImages.reportSelected,
    image: reportSelectedIcon
  },
  {
    type: MapImages.reportLargerSelected,
    image: reportLargerSelectedIcon
  },
  {
    type: MapImages.reportViirsHover,
    image: reportViirsHoverIcon
  },
  {
    type: MapImages.reportViirsDefault,
    image: reportViirsNotSelectedIcon
  },
  {
    type: MapImages.alertDefault,
    image: alertNotSelectedIcon
  },
  {
    type: MapImages.alertHover,
    image: alertHoverIcon
  },
  {
    type: MapImages.alertLargeDefault,
    image: alertLargerNotSelectedIcon
  },
  {
    type: MapImages.alertLargeHover,
    image: alertLargerHoverIcon
  },
  {
    type: MapImages.alertViirsDefault,
    image: alertViirsNotSelectedIcon
  },
  {
    type: MapImages.alertViirsHover,
    image: alerViirsHoverIcon
  },
  {
    type: MapImages.assignmentAssignedToMe,
    image: assignmentAssignedToMeIcon
  },
  {
    type: MapImages.assignmentCreatedByMe,
    image: assignmentCreateByMeIcon
  },
  {
    type: MapImages.assignmentAssignedToMeHover,
    image: assignmentAssignedToMeHoverIcon
  },
  {
    type: MapImages.assignmentCreatedByMeHover,
    image: assignmentCreateByMeHoverIcon
  },
  {
    type: MapImages.assignmentSelected,
    image: assignmentSelectedIcon
  },
  {
    type: MapImages.routePoint,
    image: routePointIcon
  },
  {
    type: MapImages.routePointSelected,
    image: routePointIconSelected
  },
  {
    type: MapImages.routePointIconUnselected,
    image: routePointIconUnselected
  },
  {
    type: MapImages.routePointIconMiddle,
    image: routePointIconMiddle
  },
  {
    type: MapImages.blank,
    image: blankIcon
  }
];

export const loadMapImage = (map: MapInstance, url: string): Promise<HTMLImageElement | ImageBitmap | undefined> => {
  return new Promise((resolve, reject) => {
    map.loadImage(url, (error, image) => {
      if (error) {
        reject(error);
      } else {
        resolve(image);
      }
    });
  });
};

export const setupMapImages = (map: MapInstance) => {
  return Promise.all(
    mapImagesArr.map(async mapImage => {
      const image = await loadMapImage(map, mapImage.image);

      if (image) {
        map.addImage(mapImage.type, image, mapImage.options);
      }
    })
  );
};

const getAllNeighbours = (
  pointsIndex: KDBush<TAlertsById>,
  firstPoint: TAlertsById,
  pointsToSearch: TAlertsById[],
  distance: number
) => {
  const neighbours: TAlertsById[] = [];

  function isIncluded(result: TAlertsById) {
    for (let i = 0; i < neighbours.length; i++) {
      if (
        result.data.latitude === neighbours[i].data.latitude &&
        result.data.longitude === neighbours[i].data.longitude
      ) {
        return true;
      }
    }
    return false;
  }

  function checkSiblings(results: TAlertsById[]) {
    for (let i = 0; i < results.length; i++) {
      if (!isIncluded(results[i])) {
        neighbours.push(results[i]);
        getNeighbours(results[i]);
      }
    }
  }

  function getNeighbours(point: TAlertsById) {
    const data = geoKDBush.around(pointsIndex, Number(point.data.longitude), Number(point.data.latitude), 8, distance);
    checkSiblings(data);
  }

  getNeighbours(firstPoint);

  return neighbours;
};

export const findNeighboringPoints = (pointsIndex: KDBush<TAlertsById>, pointsToSearch: TAlertsById[]) => {
  let pointsToSearchCopy = [...pointsToSearch];
  let neighbours: TAlertsById[] = [];

  while (pointsToSearchCopy.length > 0) {
    // We get the last point so we can use `.pop()` which is more performant
    // than `.shift()`
    const point = pointsToSearchCopy[pointsToSearchCopy.length - 1];

    neighbours = [...neighbours, ...getAllNeighbours(pointsIndex, point, pointsToSearch, 0.02)];

    // Remove the current alert from the array
    pointsToSearchCopy.pop();

    // Remove selected alerts that were already detected in neighbours as we will have
    // already also found those alert's neighbours in the original search!
    // eslint-disable-next-line no-loop-func
    pointsToSearchCopy = pointsToSearchCopy.filter((pointToSearch: TAlertsById) => {
      return (
        neighbours.findIndex(
          t => t.data.latitude === pointToSearch.data.latitude && t.data.longitude === pointToSearch.data.longitude
        ) === -1
      );
    });
  }

  // Remove duplicates
  // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects#answer-36744732
  neighbours = neighbours.filter(
    (point: TAlertsById, index: number, self) =>
      self.findIndex(t => t.data.latitude === point.data.latitude && t.data.longitude === point.data.longitude) ===
      index
  );

  // Remove any points that were already selected
  neighbours = neighbours.filter(point => pointsToSearch.findIndex(i => i.id === point.id) === -1);

  return neighbours;
};

export const getBoundFromGeoJSON = (geoJSON: any, padding = [15, 15]) => {
  const countryBounds = geoJSON.coordinates[0].map((pt: any) => [pt[1], pt[0]]);
  // @ts-ignore
  const bounds = L.latLngBounds(countryBounds, { padding });
  return bounds;
};

export const goToGeojson = (
  map: MapInstance | MapRef | null,
  geojson: any,
  animate = true,
  mapOptions?: mapboxgl.FitBoundsOptions
) => {
  const bbox = turf.bbox(geojson);
  if (map && bbox.length > 0) {
    map.fitBounds(bbox as LngLatBoundsLike, { padding: 40, animate, ...mapOptions });
  }
};

export const createLayeredClusterSVG = (props: GeoJsonProperties, colours = ["#94BE43"]) => {
  if (!props) {
    return;
  }

  const total = props.point_count;
  const fontSize = 20;
  const r = 33;
  const r0 = Math.round(r * 1);
  const w = r * 2;

  let circles = "";
  let svgWidth = w;
  let svgHeight = w;

  colours.reverse().forEach((colour, index) => {
    const xOffset = (colours.length - (index + 1)) * 10;
    const yOffset = (colours.length - (index + 1)) * 3;
    const cx = r + xOffset;
    const cy = r + yOffset;

    svgWidth += xOffset;
    svgHeight += yOffset;

    circles += `<circle cx="${cx}" cy="${cy}" r="${r0}" fill="${colour}" />
    ${
      index === colours.length - 1
        ? `<text dominant-baseline="central" transform="translate(${r}, ${r})" fill="white" font-weight="500">
    ${total.toLocaleString()}
    </text>`
        : ""
    }`;
  });

  let html = `<button>
    <svg width="${svgWidth}" height="${svgHeight}" viewbox="0 0 ${svgWidth} ${svgHeight}" text-anchor="middle" style="font: ${fontSize}px 'Fira Sans'; display: block">
      ${circles}
    </svg></button>`;

  const el = document.createElement("div");
  el.innerHTML = html;
  return el;
};

export const clusterZoom = (map: MapRef, clusterId: any, sourceId: string, coords: any) => {
  const source = map.getSource(sourceId) as GeoJSONSource;

  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) {
      return;
    }

    map.easeTo({
      center: coords,
      zoom: zoom
    });
  });
};

export type TMapIconGenerator = (alertType: string, isHovered?: boolean, isSelected?: boolean) => MapImages;

export const getReportImage: TMapIconGenerator = (alertType, isHovered, isSelected) => {
  if (isSelected) {
    switch (alertType) {
      default:
        return MapImages.reportSelected;
    }
  }

  if (isHovered) {
    switch (alertType) {
      case ReportLayers.VIIRS:
        return MapImages.reportViirsHover;
      default:
        return MapImages.reportHover;
    }
  }

  switch (alertType) {
    case ReportLayers.VIIRS:
      return MapImages.reportViirsDefault;
    default:
      return MapImages.reportDefault;
  }
};

export const getAlertImage: TMapIconGenerator = (alertType, isHover, isSelected) => {
  if (isSelected) {
    switch (alertType) {
      case EAlertTypes.GLAD:
        return MapImages.reportLargerSelected;
      default:
        return MapImages.reportSelected;
    }
  }

  if (isHover) {
    switch (alertType) {
      case EAlertTypes.VIIRS:
        return MapImages.alertViirsHover;
      case EAlertTypes.GLAD:
        return MapImages.alertLargeHover;
      default:
        return MapImages.alertHover;
    }
  }

  switch (alertType) {
    case EAlertTypes.VIIRS:
      return MapImages.alertViirsDefault;
    case EAlertTypes.GLAD:
      return MapImages.alertLargeDefault;
    default:
      return MapImages.alertDefault;
  }
};

export const getAssignmentImage: TMapIconGenerator = (alertType, isHover, isSelected) => {
  if (isSelected) {
    return MapImages.assignmentSelected;
  }

  if (isHover) {
    switch (alertType) {
      case "creator": // ToDo: move to enum
        return MapImages.assignmentCreatedByMeHover;
      default:
        return MapImages.assignmentAssignedToMeHover;
    }
  }

  switch (alertType) {
    case "creator": // ToDo: move to enum
      return MapImages.assignmentCreatedByMe;
    default:
      return MapImages.assignmentAssignedToMe;
  }
};

export type TClusterTypeColourMap = { type: string; hex: string; prop: string; not?: true }[];

export const reportClusterTypeColourMap: TClusterTypeColourMap = [
  {
    prop: "default",
    not: true,
    type: "viirs",
    hex: ReportLayerColours.DEFAULT
  },
  {
    prop: "viirs",
    type: "viirs",
    hex: ReportLayerColours.VIIRS
  }
];

export const alertClusterTypeColourMap: TClusterTypeColourMap = [
  {
    prop: "default",
    not: true,
    type: "viirs",
    hex: AlertLayerColours.DEFAULT
  },
  {
    prop: "viirs",
    type: "viirs",
    hex: AlertLayerColours.VIIRS
  }
];

export const assignmentClusterTypeColourMap: TClusterTypeColourMap = [
  {
    prop: "default",
    not: true,
    type: "creator",
    hex: AssignmentLayerColours.DEFAULT
  },
  {
    prop: "creator",
    type: "creator",
    hex: AssignmentLayerColours.CREATOR
  }
];
