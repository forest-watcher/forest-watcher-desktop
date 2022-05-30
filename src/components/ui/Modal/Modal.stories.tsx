import Modal from "./Modal";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "UI/Modal",
  component: Modal
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = args => <Modal {...args} />;

export const Standard = Template.bind({});
Standard.args = {
  isOpen: true,
  onClose: () => {},
  title: "common.create",
  children: <p>Example Create Modal</p>,
  actions: [
    {
      name: "common.save",
      variant: "primary",
      onClick: () => {}
    },
    {
      name: "common.cancel",
      variant: "secondary",
      onClick: () => {}
    }
  ]
};
