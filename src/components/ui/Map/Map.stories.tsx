import { ComponentStory, ComponentMeta } from "@storybook/react";

import Map from "components/ui/Map/Map";
import Card from "components/ui/Card/Card";
import Polygon from "./components/layers/Polygon";
import Button from "components/ui/Button/Button";
import { useState } from "react";

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

const polygon2 = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-1.8911075592041016, 50.75633249312358],
            [-1.854543685913086, 50.75671257889296],
            [-1.855316162109375, 50.760350386522795],
            [-1.8753147125244138, 50.75796141040209],
            [-1.8911075592041016, 50.75633249312358]
          ]
        ]
      }
    }
  ]
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Map",
  component: Map
} as ComponentMeta<typeof Map>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Map> = args => {
  const [selected, setSelected] = useState<null | string>(null);

  return (
    <Map {...args}>
      <Polygon
        key="1"
        id="bournemouth"
        data={polygon as GeoJSON.FeatureCollection<GeoJSON.Geometry>}
        onClick={id => setSelected(id)}
      />
      <Polygon
        key="2"
        id="bournemouth2"
        data={polygon2 as GeoJSON.FeatureCollection<GeoJSON.Geometry>}
        onClick={id => setSelected(id)}
      />
      {selected && (
        <Card className="c-map__card-control">
          <Card.Title>Example Popup</Card.Title>
          <Card.Text>Selected polygon {selected}</Card.Text>
          <Button className="u-margin-top" onClick={() => setSelected(null)}>
            Close
          </Button>
        </Card>
      )}
    </Map>
  );
};

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {};
