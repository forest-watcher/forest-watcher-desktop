import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FC } from "react";
import { UseControllerProps, useForm } from "react-hook-form";
import RadioGroup, { IProps } from "./RadioGroup";

export default {
  title: "ui/Form/RadioGroup",
  component: RadioGroup
} as ComponentMeta<typeof RadioGroup>;

type TRadioGroupFrom = { radioGroup?: number };
type IComponentStoryProps = FC<IProps<TRadioGroupFrom> & Omit<UseControllerProps<TRadioGroupFrom>, "name">>;

const Template: ComponentStory<IComponentStoryProps> = args => {
  const { control } = useForm<TRadioGroupFrom>();

  return (
    <div className="w-[375px]">
      <RadioGroup<TRadioGroupFrom> control={control} name="radioGroup" {...args} />
    </div>
  );
};

export const Standard = Template.bind({});
Standard.args = {
  label: "Hello",
  options: [
    {
      key: "1",
      label: "Option 1",
      value: 1
    },
    {
      key: "2",
      label: "Option 2",
      value: 2
    }
  ]
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  ...Standard.args,
  defaultValue: 2
};
