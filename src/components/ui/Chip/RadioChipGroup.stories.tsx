import { ComponentStory, ComponentMeta } from "@storybook/react";

import RadioChipGroup from "components/ui/Chip/RadioChipGroup";
import { SecondaryLightText } from "./Chip.stories";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/RadioChipGroup",
  component: RadioChipGroup
} as ComponentMeta<typeof RadioChipGroup>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RadioChipGroup> = args => <RadioChipGroup {...args} />;

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  label: "label",
  onChange: v => {},
  options: [
    {
      value: "email",
      name: "email"
    },
    {
      value: "Zip",
      name: "Zip"
    },
    {
      value: "Pigeon",
      name: "Pigeon"
    }
  ]
};

export const Grouped = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Grouped.args = {
  isGrouped: true,
  onChange: v => {},
  options: [
    {
      value: "email",
      name: "email"
    },
    {
      value: "Zip",
      name: "Zip"
    },
    {
      value: "Pigeon",
      name: "Pigeon"
    }
  ]
};

Grouped.parameters = {
  backgrounds: { default: "dark" }
};
