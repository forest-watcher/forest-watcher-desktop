import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FormattedMessage } from "react-intl";
import { BrowserRouter, Link } from "react-router-dom";
import Hero from "./Hero";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Layout/Hero",
  component: Hero
} as ComponentMeta<typeof Hero>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Hero> = args => (
  <BrowserRouter>
    <Hero {...args} />
  </BrowserRouter>
);

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default = Template.bind({});
Default.args = {
  title: "teams.details.name",
  titleValues: { name: "FED" },
  actions: (
    <>
      <Link to={`/`} className="c-teams-details__edit-btn c-button c-button--primary">
        <FormattedMessage id="teams.details.edit" />
      </Link>
      <Link to={`/`} className="c-button c-button--secondary-light-text">
        <FormattedMessage id="teams.details.delete" />
      </Link>
    </>
  ),
  backLink: { name: "teams.details.back", to: "/teams" }
};

export const WithTabs = Template.bind({});
WithTabs.args = {
  title: "teams.details.name",
  titleValues: { name: "FED" },
  actions: (
    <>
      <Link to={`/`} className="c-teams-details__edit-btn c-button c-button--primary">
        <FormattedMessage id="teams.details.edit" />
      </Link>
      <Link to={`/`} className="c-button c-button--secondary-light-text">
        <FormattedMessage id="teams.details.delete" />
      </Link>
    </>
  ),
  backLink: { name: "teams.details.back", to: "/teams" },
  pageTabs: {
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
  }
};
