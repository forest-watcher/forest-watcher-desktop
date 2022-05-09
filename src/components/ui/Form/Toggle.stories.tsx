import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useForm } from "react-hook-form";

import Toggle from "components/ui/Form/Toggle";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Form/Toggle",
  component: Toggle
} as ComponentMeta<typeof Toggle>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const InputTemplate: ComponentStory<typeof Toggle> = args => {
  const formhook = useForm();
  const { register } = formhook;
  return <Toggle {...args} registered={register("exampleSelect")} formHook={formhook} />;
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
