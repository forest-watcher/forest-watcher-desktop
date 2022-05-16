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
