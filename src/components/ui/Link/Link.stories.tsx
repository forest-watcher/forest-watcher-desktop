import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AnchorHTMLAttributes, HTMLProps } from "react";

import { Link, BrowserRouter } from "react-router-dom";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Link",
  component: Link
} as ComponentMeta<typeof Link>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Example: ComponentStory<typeof Link> = args => (
  <BrowserRouter>
    <Link {...args} to="/" className="c-link">
      Click me
    </Link>
  </BrowserRouter>
);