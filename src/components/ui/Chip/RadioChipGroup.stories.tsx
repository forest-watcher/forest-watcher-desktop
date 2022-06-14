import { ComponentStory, ComponentMeta } from "@storybook/react";

import RadioChipGroup from "components/ui/Chip/RadioChipGroup";

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
  variant: "primary"
};
