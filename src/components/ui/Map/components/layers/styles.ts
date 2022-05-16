const primary500 = "#94BE43";
const neutral300 = "#FFFFFF";

export const polygonStyle = {
  id: "polygon",
  type: "fill",
  paint: {
    "fill-color": primary500,
    "fill-opacity": 0.6
  }
};

export const polygonLineStyle = {
  id: "polygon-line",
  type: "line",
  layout: {
    "line-join": "round"
  },
  paint: {
    "line-color": primary500,
    "line-width": 5
  }
};

export const polygonLineStyleHover = {
  id: "polygon-line",
  type: "line",
  layout: {
    "line-join": "round"
  },
  paint: {
    "line-color": neutral300,
    "line-width": 5
  }
};

export const labelStyle = {
  id: "labels",
  type: "symbol",
  source: "places",
  minzoom: 10,
  layout: {
    "text-field": ["get", "description"],
    "text-anchor": "center",
    "text-justify": "auto",
    "text-size": 18,
    "icon-text-fit": "both",
    "icon-image": "label-background"
  },
  paint: {
    "text-color": "#555555"
  }
};
