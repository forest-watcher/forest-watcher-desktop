import { ComponentStory, ComponentMeta } from "@storybook/react";
import LinkPreview from "components/ui/LinkPreview/LinkPreview";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/LinkPreview",
  component: LinkPreview
} as ComponentMeta<typeof LinkPreview>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LinkPreview> = args => <LinkPreview {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "https://storybook.js.org/docs/react/writing-stories/args",
  btnCaption: "Copy Link",
  className: ""
};
