import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FC } from "react";
import { UseControllerProps, useForm } from "react-hook-form";
import MultiSelectDialog, { IProps, IMultiSelectDialogPreviewProps } from "./MultiSelectDialog";

type TMultiSelectDialogFormFields = {
  monitors: string[];
};

export default {
  title: "ui/Form/MultiSelectDialog",
  component: MultiSelectDialog,
  subcomponents: { Preview: MultiSelectDialog.Preview }
} as ComponentMeta<typeof MultiSelectDialog>;

const Template: ComponentStory<FC<IProps>> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>({
    defaultValues: { monitors: [] }
  });

  return <MultiSelectDialog<TMultiSelectDialogFormFields> {...args} control={control} name="monitors" />;
};

const EmptyPreviewTemplate: ComponentStory<typeof MultiSelectDialog.Preview> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>();

  return (
    <div className="w-[375px]">
      <MultiSelectDialog.Preview<TMultiSelectDialogFormFields> {...args} name="monitors" control={control} />
    </div>
  );
};

const PreviewTemplate: ComponentStory<typeof MultiSelectDialog.Preview> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>({
    defaultValues: {
      monitors: ["Me"]
    }
  });

  return (
    <div className="w-[375px]">
      <MultiSelectDialog.Preview<TMultiSelectDialogFormFields> {...args} name="monitors" control={control} />
    </div>
  );
};

export const Standard = Template.bind({});
Standard.args = {
  groups: [
    {
      label: "Default",
      options: [{ value: "Me", label: "Me" }]
    }
  ]
};

export const EmptyPreview = EmptyPreviewTemplate.bind({});
EmptyPreview.args = {
  groups: [
    {
      label: "Default",
      options: [{ value: "Me", label: "Me" }]
    }
  ],
  label: "Monitors",
  addButtonLabel: "Add Monitor",
  emptyLabel: "No Monitors Selected",
  emptyIcon: "white-foot"
};

export const PopulatedPreview = PreviewTemplate.bind({});
PopulatedPreview.args = {
  ...EmptyPreview.args
};
