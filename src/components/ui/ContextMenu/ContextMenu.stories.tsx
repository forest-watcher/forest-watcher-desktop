import ContextMenu from "./ContextMenu";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import kebabIcon from "../../../assets/images/icons/kebab.svg";
import Button from "../Button/Button";

export default {
  title: "UI/ContextMenu",
  component: ContextMenu
} as ComponentMeta<typeof ContextMenu>;

const Template: ComponentStory<typeof ContextMenu> = args => <ContextMenu {...args} />;

export const Standard = Template.bind({});
Standard.args = {
  menuButton: (
    <Button aria-label="Open Menu" isIcon={true} variant="blank">
      <img alt="" role="presentation" src={kebabIcon} />
    </Button>
  ),
  menuItems: [
    { name: "Foo", onClick: () => {} },
    { name: "Bar", onClick: () => {} }
  ],
  offsetY: 12
};
