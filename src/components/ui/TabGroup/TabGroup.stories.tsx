import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import TabGroup from "./TabGroup";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/TabGroup",
  component: TabGroup
} as ComponentMeta<typeof TabGroup>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TabGroup> = args => (
  <BrowserRouter>
    <TabGroup {...args} />
  </BrowserRouter>
);

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  value: "investigation",
  options: [
    {
      value: "investigation",
      name: "reporting.tabs.investigation",
      href: "/reporting/investigation"
    },
    {
      value: "reports",
      name: "reporting.tabs.reports",
      href: "/reporting/reports"
    }
  ]
};

Standard.parameters = {
  backgrounds: { default: "dark" }
};
