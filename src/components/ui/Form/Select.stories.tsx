import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useForm } from "react-hook-form";
import { Option } from "types/select";

import Select from "components/ui/Form/Select";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Form/Select",
  component: Select
} as ComponentMeta<typeof Select>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const InputTemplate: ComponentStory<typeof Select> = args => {
  const formhook = useForm();
  const { register } = formhook;
  return <Select {...args} registered={register("exampleSelect")} formHook={formhook} />;
};

const options: Option[] = [
  {
    label: "Cat",
    value: "cat"
  },
  {
    label: "Dog",
    value: "dog"
  },
  {
    label: "Hamster",
    value: "hamster"
  },
  {
    label: "Panda",
    value: "panda"
  }
];

export const Standard = InputTemplate.bind({});
Standard.args = {
  id: "text-input",
  selectProps: {
    placeholder: "Select something",
    options,
    label: "Hello"
  }
};

export const DefaultValue = InputTemplate.bind({});
DefaultValue.args = {
  id: "text-input",
  selectProps: {
    placeholder: "Select something",
    options,
    label: "Hello",
    defaultValue: options[0]
  }
};

export const Error = InputTemplate.bind({});
Error.args = {
  id: "text-input",
  selectProps: {
    placeholder: "Select something",
    options,
    label: "Errored input"
  },
  error: {
    message: "This is a required field"
  }
};

export const AlternateLabel = InputTemplate.bind({});
AlternateLabel.args = {
  id: "text-input",
  selectProps: {
    placeholder: "Select something",
    options,
    label: "Hello",
    alternateLabelStyle: true
  }
};
