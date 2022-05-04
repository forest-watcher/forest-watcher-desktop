import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useForm } from "react-hook-form";

import Input from "components/ui/Form/Input";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Form/Text",
  component: Input
} as ComponentMeta<typeof Input>;

// WIP type FormValues = {
//   exampleInput: string;
// };

// WIP const schema = yup
//   .object({
//     exampleInput: yup.string().required()
//   })
//   .required();

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const InputTemplate: ComponentStory<typeof Input> = args => {
  const { register } = useForm();
  return <Input {...args} registered={register("exampleInput", { required: true })} />;
};

// WIP const FormTemplate: ComponentStory<typeof Input> = args => {
//   const { register, handleSubmit, watch, formState } = useForm<FormValues>({
//     resolver: yupResolver(schema)
//   });
//   const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Input
//         {...args}
//         registered={register("exampleInput", { required: true })}
//         error={formState.errors.exampleInput}
//       />
//       <input type="submit" />
//     </form>
//   );
// };

export const Standard = InputTemplate.bind({});
Standard.args = {
  id: "text-input",
  htmlInputProps: {
    type: "text",
    placeholder: "Enter text",
    label: "Hello",
    onChange: () => {}
  }
};

export const DefaultValue = InputTemplate.bind({});
DefaultValue.args = {
  id: "text-input",
  htmlInputProps: {
    type: "text",
    placeholder: "Enter text",
    label: "Hello",
    defaultValue: "This is some default text",
    onChange: () => {}
  }
};

export const Error = InputTemplate.bind({});
Error.args = {
  id: "text-input",
  htmlInputProps: {
    type: "text",
    placeholder: "Enter text",
    label: "Errored input",
    onChange: () => {}
  },
  error: {
    message: "This is a required field"
  }
};
