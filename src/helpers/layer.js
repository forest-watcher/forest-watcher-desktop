export const parseLayer = function (layer) {
  return {
    name: layer.title,
    url: layer.tileurl
  };
};
