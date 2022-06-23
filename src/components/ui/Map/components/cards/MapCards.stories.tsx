import { ComponentStory, ComponentMeta } from "@storybook/react";

import MapCard from "components/ui/Map/components/cards/MapCard";
import Card from "components/ui/Card/Card";
import Button from "components/ui/Button/Button";
import { useState } from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Map/Cards",
  component: MapCard
} as ComponentMeta<typeof MapCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const MapCardTemplate: ComponentStory<typeof MapCard> = args => {
  return (
    <MapCard
      title="Map Card"
      onBack={() => {}}
      footer={
        <>
          <Button>Close</Button>
        </>
      }
    >
      <p>This is some content</p>
      <p>That sits in the card!</p>
    </MapCard>
  );
};

export const MapCardStandard = MapCardTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MapCardStandard.args = {};
