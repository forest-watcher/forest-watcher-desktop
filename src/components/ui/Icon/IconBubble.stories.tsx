import { ComponentStory, ComponentMeta } from "@storybook/react";
import IconBubble from "./IconBubble";

export default {
  title: "ui/IconBubble",
  component: IconBubble
} as ComponentMeta<typeof IconBubble>;

const Template: ComponentStory<typeof IconBubble> = args => <IconBubble {...args} />;

export const Standard = Template.bind({});
Standard.args = {
  name: "flag-white"
};
