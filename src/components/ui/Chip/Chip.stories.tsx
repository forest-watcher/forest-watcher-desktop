import { ComponentStory, ComponentMeta } from "@storybook/react";

import Chip from "components/ui/Chip/Chip";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Chip",
  component: Chip
} as ComponentMeta<typeof Chip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Chip> = args => <Chip {...args}>Chip</Chip>;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  variant: "primary"
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary"
};

export const Selectable = Template.bind({});
Selectable.args = {
  variant: "primary",
  isSelectable: true
};
