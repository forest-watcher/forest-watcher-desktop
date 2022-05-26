import ContextMenu from "./ContextMenu";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "UI/ContextMenu",
  component: ContextMenu
} as ComponentMeta<typeof ContextMenu>;

const Template: ComponentStory<typeof ContextMenu> = args => <ContextMenu {...args} />;

export const Standard = Template.bind({});
Standard.args = {
  menuItems: [
    { name: "Foo", onClick: () => {} },
    { name: "Bar", onClick: () => {} }
  ],
  offsetY: 8
};
