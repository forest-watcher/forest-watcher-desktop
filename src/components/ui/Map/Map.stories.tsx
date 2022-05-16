import { ComponentStory, ComponentMeta } from "@storybook/react";

import Map from "components/ui/Map/Map";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Map",
  component: Map
} as ComponentMeta<typeof Map>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Map> = args => <Map {...args} />;

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {};
