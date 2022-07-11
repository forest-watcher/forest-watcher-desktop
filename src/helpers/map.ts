import { Map as MapInstance, LngLatBoundsLike, GeoJSONSource } from "mapbox-gl";
import labelBackgroundIcon from "assets/images/icons/MapLabelFrame.png";
import reportNotSelectedIcon from "assets/images/icons/alertIcons/ReportNotSelected.png";
import reportHoverIcon from "assets/images/icons/alertIcons/ReportHover.png";
import reportSelectedIcon from "assets/images/icons/alertIcons/ReportSelected.png";
import reportViirsNotSelectedIcon from "assets/images/icons/alertIcons/ReportViirsDefault.png";
import reportViirsHoverIcon from "assets/images/icons/alertIcons/ReportViirsHover.png";

import L from "leaflet";
import * as turf from "@turf/turf";
import { GeoJsonProperties } from "geojson";
import { MapRef } from "react-map-gl";
import { IPoint, ReportLayers } from "types/map";

export enum MapImages {
  label = "label",
  reportDefault = "report-default",
  reportHover = "report-hover",
  reportSelected = "report-selected",
  reportViirsHover = "report-viirs-hover",
  reportViirsDefault = "report-viirs-default"
}

const mapImagesArr = [
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
    type: MapImages.reportViirsHover,
    image: reportViirsHoverIcon
  },
  {
    type: MapImages.reportViirsDefault,
    image: reportViirsNotSelectedIcon
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
  mapImagesArr.forEach(async mapImage => {
    const image = await loadMapImage(map, mapImage.image);

    if (image) {
      map.addImage(mapImage.type, image, mapImage.options);
    }
  });
};

export const getBoundFromGeoJSON = (geoJSON: any, padding = [15, 15]) => {
  const countryBounds = geoJSON.coordinates[0].map((pt: any) => [pt[1], pt[0]]);
  // @ts-ignore
  const bounds = L.latLngBounds(countryBounds, { padding });
  return bounds;
};

export const goToGeojson = (map: MapInstance | null, geojson: any, animate = true) => {
  const bbox = turf.bbox(geojson);
  if (map && bbox.length > 0) {
    map.fitBounds(bbox as LngLatBoundsLike, { padding: 40, animate });
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

export const getReportImage = (point: IPoint, hoveredPoint: string | null, selectedPoint: string | null) => {
  if (point.id === selectedPoint) {
    switch (point.layer) {
      default:
        return MapImages.reportSelected;
    }
  }

  if (point.id === hoveredPoint) {
    switch (point.layer) {
      case ReportLayers.VIIRS:
        return MapImages.reportViirsHover;
      default:
        return MapImages.reportHover;
    }
  }

  switch (point.layer) {
    case ReportLayers.VIIRS:
      return MapImages.reportViirsDefault;
    default:
      return MapImages.reportDefault;
  }
};
