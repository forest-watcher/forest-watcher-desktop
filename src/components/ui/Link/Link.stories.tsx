import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FC } from "react";

import { Link, BrowserRouter } from "react-router-dom";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Link",
  component: Link
} as ComponentMeta<typeof Link>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const ReactRouter: ComponentStory<typeof Link> = args => (
  <BrowserRouter>
    <Link {...args} to="/" className="c-link">
      Click me
    </Link>
  </BrowserRouter>
);

export const AnchorElement: ComponentStory<FC> = args => (
  <a {...args} href="/" className="c-link">
    Click me
  </a>
);
