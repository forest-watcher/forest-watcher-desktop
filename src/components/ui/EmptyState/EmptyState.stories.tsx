import { ComponentStory, ComponentMeta } from "@storybook/react";
import EmptyState from "components/ui/EmptyState/EmptyState";
import PeopleIcon from "assets/images/icons/People.svg";
import { BrowserRouter } from "react-router-dom";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Empty State",
  component: EmptyState
} as ComponentMeta<typeof EmptyState>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EmptyState> = args => (
  <BrowserRouter>
    <EmptyState {...args} />
  </BrowserRouter>
);

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  iconUrl: PeopleIcon,
  title: "No Teams Added",
  text: "Create an area to start assigning teams",
  ctaText: "Create Area",
  ctaTo: "/"
};
