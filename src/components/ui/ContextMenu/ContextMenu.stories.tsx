import ContextMenu from "./ContextMenu";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

export default {
  title: "UI/ContextMenu",
  component: ContextMenu
} as ComponentMeta<typeof ContextMenu>;

const Template: ComponentStory<typeof ContextMenu> = args => (
  <BrowserRouter>
    <ContextMenu {...args} />
  </BrowserRouter>
);

export const Standard = Template.bind({});
Standard.args = {
  menuItems: [
    { name: "common.edit", onClick: () => {} },
    { name: "common.delete", onClick: () => {} }
  ],
  offsetY: 8
};

export const MenuItemsAsLinks = Template.bind({});
MenuItemsAsLinks.args = {
  menuItems: [
    { name: "common.edit", href: "/foo" },
    { name: "common.delete", href: "/bar" }
  ],
  offsetY: 8
};
