import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useForm } from "react-hook-form";

import Toggle from "components/ui/Form/Toggle";
import ToggleGroup from "components/ui/Form/ToggleGroup";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Form/Toggle",
  component: Toggle
} as ComponentMeta<typeof Toggle | typeof ToggleGroup>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const InputTemplate: ComponentStory<typeof Toggle> = args => {
  const formhook = useForm();
  const { register } = formhook;
  return <Toggle {...args} registered={register("exampleSelect")} formHook={formhook} />;
};

const ToggleGroupTemplate: ComponentStory<typeof ToggleGroup> = args => {
  const formhook = useForm();
  const { register } = formhook;
  return (
    <div style={{ width: 400 }}>
      <ToggleGroup {...args} registered={register("exampleSelect")} formHook={formhook} />
    </div>
  );
};

export const Standard = InputTemplate.bind({});
Standard.args = {
  id: "toggle-input",
  toggleProps: {
    label: "Hello"
  }
};

export const DefaultValue = InputTemplate.bind({});
DefaultValue.args = {
  id: "toggle-input",
  toggleProps: {
    label: "Hello",
    defaultValue: true
  }
};

export const ToggleGroupStandard = ToggleGroupTemplate.bind({});
ToggleGroupStandard.args = {
  id: "toggle-input",
  toggleGroupProps: {
    label: "Pick an option",
    options: [
      {
        label: "Option 1",
        value: "1"
      },
      {
        label: "Option 2",
        value: "2"
      },
      {
        label: "Option 3",
        value: "3"
      }
    ],
    defaultValue: []
  }
};
