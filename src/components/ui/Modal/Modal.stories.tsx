import { ComponentStory, ComponentMeta } from "@storybook/react";
import Modal from "components/ui/Modal/Modal";
import { useState } from "react";
import Button from "../Button/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Modals/Generic Modal",
  component: Modal
} as ComponentMeta<typeof Modal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Modal> = args => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        actions={[
          { name: "common.stay", onClick: () => setIsOpen(false) },
          { name: "common.leave.page", variant: "secondary", onClick: () => setIsOpen(false) }
        ]}
      >
        <div className="c-unsaved-changes-modal">
          <p>Look at me, I'm a modal!</p>
        </div>
      </Modal>
    </div>
  );
};

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  title: "common.unsaved.changes"
};
