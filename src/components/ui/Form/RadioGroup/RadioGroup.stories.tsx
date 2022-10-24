import { ComponentStory, ComponentMeta } from "@storybook/react";
import RadioGroup from "./RadioGroup";

export default {
  title: "ui/RadioGroup",
  component: RadioGroup
} as ComponentMeta<typeof RadioGroup>;

const Template: ComponentStory<typeof RadioGroup> = args => <RadioGroup {...args} />;

export const Standard = Template.bind({});
Standard.args = {};
