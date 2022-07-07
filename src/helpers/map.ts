import { Map as MapInstance, LngLatBoundsLike } from "mapbox-gl";
import labelBackgroundIcon from "assets/images/icons/MapLabelFrame.png";
import reportNotSelectedIcon from "assets/images/icons/alertIcons/ReportNotSelected.png";
import reportHoverIcon from "assets/images/icons/alertIcons/ReportHover.png";
import L from "leaflet";
import * as turf from "@turf/turf";

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

export const addMapLabelImage = async (map: MapInstance) => {
  const image = await loadMapImage(map, labelBackgroundIcon);

  if (image) {
    map.addImage("label-background", image, {
      // The pixels that can be stretched horizontally:
      // @ts-ignore
      stretchX: [[3, 30]],
      // The row of pixels that can be stretched vertically:
      stretchY: [[3, 30]],
      // This part of the image that can contain text ([x1, y1, x2, y2]):
      content: [5, 5, 28, 28],
      pixelRatio: 1
    });
  }
};

export const addAlertIconImages = async (map: MapInstance) => {
  const image = await loadMapImage(map, reportNotSelectedIcon);
  if (image) {
    map.addImage("report-not-selected", image, {
      pixelRatio: 1
    });
  }
  const image2 = await loadMapImage(map, reportHoverIcon);
  if (image2) {
    map.addImage("report-hover", image2, {
      pixelRatio: 1
    });
  }
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
