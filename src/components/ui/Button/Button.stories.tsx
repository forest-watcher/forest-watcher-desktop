import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "components/ui/Button/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Button",
  component: Button
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = args => <Button {...args}>Click me</Button>;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  variant: "primary"
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary"
};
