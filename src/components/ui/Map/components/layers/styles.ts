const primary500 = "#94BE43";
const neutral300 = "#FFFFFF";

export const pointStyle = {
  id: "point",
  type: "symbol",
  layout: {
    "icon-image": ["get", "icon"],
    "icon-size": 1,
    "icon-allow-overlap": true
  },
  filter: ["!", ["has", "point_count"]]
};

export const clusterStyle = {
  id: "clusters",
  type: "circle",
  filter: ["has", "point_count"],
  paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    "circle-color": "#94BE43",
    "circle-radius": 33
  }
};

export const clusterCountStyle = {
  id: "cluster-count",
  type: "symbol",
  filter: ["has", "point_count"],
  glyphs: "mapbox://fonts/3sidedcube/{fontstack}/{range}.pbf",
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["Fira Sans Regular", "Arial Unicode MS Bold"],
    "text-size": 20
  },
  paint: {
    "text-color": "#ffffff"
  }
};

export const polygonStyle = {
  id: "polygon",
  type: "fill",
  layout: {
    "fill-sort-key": 0
  },
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
  minzoom: 5,
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

// Adapted from https://github.com/mapbox/mapbox-gl-draw/blob/0efdb4d14a0ecae37cfe467334aaa5b2e501f702/src/lib/theme.js
export const editStyles = [
  {
    id: "gl-draw-polygon-fill-inactive",
    type: "fill",
    filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    paint: {
      "fill-color": primary500,
      "fill-outline-color": primary500,
      "fill-opacity": 0.6
    }
  },
  {
    id: "gl-draw-polygon-fill-active",
    type: "fill",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": primary500,
      "fill-outline-color": primary500,
      "fill-opacity": 0.6
    }
  },
  {
    id: "gl-draw-polygon-midpoint-halo",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": 5,
      "circle-color": neutral300
    }
  },
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": 3,
      "circle-color": primary500
    }
  },
  {
    id: "gl-draw-polygon-stroke-inactive",
    type: "line",
    filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": primary500,
      "line-width": 5
    }
  },
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": neutral300,
      "line-dasharray": [2, 3],
      "line-width": 3
    }
  },
  {
    id: "gl-draw-line-inactive",
    type: "line",
    filter: ["all", ["==", "active", "false"], ["==", "$type", "LineString"], ["!=", "mode", "static"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": primary500,
      "line-width": 5
    }
  },
  {
    id: "gl-draw-line-active",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": neutral300,
      "line-dasharray": [2, 3],
      "line-width": 3
    }
  },
  {
    id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 8,
      "circle-color": neutral300
    }
  },
  {
    id: "gl-draw-polygon-and-line-vertex-inactive",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 6,
      "circle-color": primary500
    }
  },
  {
    id: "gl-draw-point-point-stroke-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"]
    ],
    paint: {
      "circle-radius": 5,
      "circle-opacity": 1,
      "circle-color": neutral300
    }
  },
  {
    id: "gl-draw-point-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"]
    ],
    paint: {
      "circle-radius": 3,
      "circle-color": primary500
    }
  },
  {
    id: "gl-draw-point-stroke-active",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "active", "true"], ["!=", "meta", "midpoint"]],
    paint: {
      "circle-radius": 7,
      "circle-color": neutral300
    }
  },
  {
    id: "gl-draw-point-active-stroke",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"], ["==", "active", "true"]],
    paint: {
      "circle-radius": 10,
      "circle-color": neutral300
    }
  },
  {
    id: "gl-draw-point-active",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"], ["==", "active", "true"]],
    paint: {
      "circle-radius": 8,
      "circle-color": primary500
    }
  },
  {
    id: "gl-draw-polygon-fill-static",
    type: "fill",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#404040",
      "fill-outline-color": "#404040",
      "fill-opacity": 0.1
    }
  },
  {
    id: "gl-draw-polygon-stroke-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#404040",
      "line-width": 5
    }
  },
  {
    id: "gl-draw-line-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#404040",
      "line-width": 5
    }
  },
  {
    id: "gl-draw-point-static",
    type: "circle",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
    paint: {
      "circle-radius": 5,
      "circle-color": "#404040"
    }
  }
];
