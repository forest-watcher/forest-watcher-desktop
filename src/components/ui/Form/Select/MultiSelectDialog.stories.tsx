import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FC } from "react";
import { UseControllerProps, useForm } from "react-hook-form";
import MultiSelectDialog, { IMultiSelectDialogPreviewProps } from "./MultiSelectDialog";

export default {
  title: "ui/Form/MultiSelectDialog",
  component: MultiSelectDialog,
  subcomponents: { Preview: MultiSelectDialog.Preview }
} as ComponentMeta<typeof MultiSelectDialog>;

type TMultiSelectDialogFormFields = {
  monitors: string[];
};

const Template: ComponentStory<typeof MultiSelectDialog> = args => <MultiSelectDialog {...args} />;

const EmptyPreviewTemplate: ComponentStory<FC<IMultiSelectDialogPreviewProps>> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>();

  return (
    <div className="w-[375px]">
      <MultiSelectDialog.Preview<TMultiSelectDialogFormFields> control={control} name="monitors" {...args} />
    </div>
  );
};

const PreviewTemplate: ComponentStory<
  FC<IMultiSelectDialogPreviewProps & Omit<UseControllerProps<TMultiSelectDialogFormFields>, "name">>
> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>();

  return (
    <div className="w-[375px]">
      <MultiSelectDialog.Preview control={control} name="monitors" {...args} />
    </div>
  );
};

export const EmptyPreview = EmptyPreviewTemplate.bind({});
EmptyPreview.args = {
  label: "Monitors",
  addButtonLabel: "Add Monitor",
  emptyLabel: "No Monitors Selected",
  emptyIcon: "white-foot"
};

export const PopulatedPreview = PreviewTemplate.bind({});
PopulatedPreview.args = {
  ...EmptyPreview.args,
  defaultValue: ["Tim", "Bob"]
};
