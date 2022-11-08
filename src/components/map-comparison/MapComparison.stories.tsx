import { ComponentStory, ComponentMeta } from "@storybook/react";

import Map from "components/ui/Map/Map";
import MapComparison from "./MapComparison";
import ReactMap from "react-map-gl";
import Polygon from "components/ui/Map/components/layers/Polygon";
import { CSSProperties } from "react";

const polygon = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-1.8628692626953125, 50.71624327418379],
            [-1.8474197387695312, 50.7295015014743],
            [-1.8724822998046877, 50.74210420580329],
            [-1.9267272949218748, 50.739279756586456],
            [-1.9373703002929688, 50.71863437930216],
            [-1.874542236328125, 50.71080849067365],
            [-1.8628692626953125, 50.71624327418379]
          ]
        ]
      }
    }
  ]
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/MapComparison",
  component: MapComparison
} as ComponentMeta<typeof MapComparison>;

const style: CSSProperties = { position: "absolute", top: 0, bottom: 0, width: "100%" };

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const DefaultTemplate: ComponentStory<typeof MapComparison> = args => {
  return (
    <>
      <MapComparison
        {...args}
        renderBefore={cb => (
          <Map
            mapStyle="mapbox://styles/3sidedcube/cl5axl8ha002c14o5exjzmdlb"
            onMapLoad={e => cb(e.target)}
            shouldWrapContainer={false}
            style={style}
            cooperativeGestures={false}
            uncontrolled
          />
        )}
        renderAfter={cb => (
          <Map
            mapStyle="mapbox://styles/3sidedcube/cl5s9e9d8000814rvhgohedy4"
            onMapLoad={e => cb(e.target)}
            shouldWrapContainer={false}
            style={style}
            cooperativeGestures={false}
            uncontrolled
          />
        )}
      />
    </>
  );
};

const PolygonTemplate: ComponentStory<typeof MapComparison> = args => {
  const Bournemouth = (
    <Polygon
      key="1"
      id="bournemouth"
      label="Bournemouth"
      data={polygon as GeoJSON.FeatureCollection<GeoJSON.Geometry>}
    />
  );
  return (
    <>
      <MapComparison
        {...args}
        renderBefore={cb => (
          <Map
            mapStyle="mapbox://styles/3sidedcube/cl5axl8ha002c14o5exjzmdlb"
            onMapLoad={e => cb(e.target)}
            shouldWrapContainer={false}
            style={style}
            cooperativeGestures={false}
            uncontrolled
          >
            {Bournemouth}
          </Map>
        )}
        renderAfter={cb => (
          <Map
            mapStyle="mapbox://styles/3sidedcube/cl5s9e9d8000814rvhgohedy4"
            onMapLoad={e => cb(e.target)}
            shouldWrapContainer={false}
            style={style}
            cooperativeGestures={false}
            uncontrolled
          >
            {Bournemouth}
          </Map>
        )}
      />
    </>
  );
};

const ReactMapTemplate: ComponentStory<typeof MapComparison> = args => {
  return (
    <>
      <MapComparison
        {...args}
        renderBefore={cb => (
          <ReactMap
            mapStyle="mapbox://styles/3sidedcube/cl5axl8ha002c14o5exjzmdlb"
            onLoad={e => cb(e.target)}
            style={style}
          />
        )}
        renderAfter={cb => (
          <ReactMap
            mapStyle="mapbox://styles/3sidedcube/cl5s9e9d8000814rvhgohedy4"
            onLoad={e => cb(e.target)}
            style={style}
          />
        )}
      />
    </>
  );
};

export const Standard = DefaultTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {};

export const WithPolygon = PolygonTemplate.bind({});
WithPolygon.args = {};

export const ReactMapExample = ReactMapTemplate.bind({});
ReactMapExample.args = {};
