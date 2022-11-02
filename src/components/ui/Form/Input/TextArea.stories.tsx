import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useForm } from "react-hook-form";
import TextArea from "./TextArea";

export default {
  title: "ui/Form/TextArea",
  component: TextArea
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = args => {
  const { control } = useForm<{ textArea: string }>();

  return <TextArea {...args} control={control} name="textArea" />;
};

export const Standard = Template.bind({});
Standard.args = {
  label: "assignment.create.form.notesForMonitors",
  placeholder: "assignment.create.form.notesForMonitors",
  altLabel: false,
  hideLabel: false
};
