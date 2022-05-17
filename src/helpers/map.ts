import { Map as MapInstance } from "mapbox-gl";
import labelBackgroundIcon from "assets/images/icons/MapLabelFrame.png";

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
