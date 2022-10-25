import { ComponentStory, ComponentMeta } from "@storybook/react";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import MultiSelectDialog, { IProps } from "./MultiSelectDialog";

type TMultiSelectDialogFormFields = {
  monitors: string[];
};

export default {
  title: "ui/Form/MultiSelectDialog",
  component: MultiSelectDialog,
  subcomponents: { Preview: MultiSelectDialog.Preview }
} as ComponentMeta<typeof MultiSelectDialog>;

const EmptyTemplate: ComponentStory<FC<IProps>> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>({
    defaultValues: { monitors: [] }
  });

  return (
    <div className="w-[300px]">
      <MultiSelectDialog<TMultiSelectDialogFormFields> {...args} control={control} name="monitors" />
    </div>
  );
};

const Template: ComponentStory<FC<IProps>> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>({
    defaultValues: {
      monitors: ["Me", "1", "4", "6"]
    }
  });

  return (
    <div className="w-[300px]">
      <MultiSelectDialog<TMultiSelectDialogFormFields> {...args} control={control} name="monitors" />
    </div>
  );
};

const EmptyPreviewTemplate: ComponentStory<typeof MultiSelectDialog.Preview> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>();

  return (
    <div className="w-[300px]">
      <MultiSelectDialog.Preview<TMultiSelectDialogFormFields> {...args} name="monitors" control={control} />
    </div>
  );
};

const PreviewTemplate: ComponentStory<typeof MultiSelectDialog.Preview> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>({
    defaultValues: {
      monitors: ["Me", "1", "4", "6"]
    }
  });

  return (
    <div className="w-[300px]">
      <MultiSelectDialog.Preview<TMultiSelectDialogFormFields> {...args} name="monitors" control={control} />
    </div>
  );
};

const Combined: ComponentStory<typeof MultiSelectDialog.Preview> = args => {
  const { control } = useForm<TMultiSelectDialogFormFields>({
    defaultValues: {
      monitors: ["Me", "1", "4", "6"]
    }
  });

  const [isDialogOpen, setOpenDialog] = useState(false);

  return (
    <div className="w-[300px]">
      <OptionalWrapper
        data={isDialogOpen}
        elseComponent={
          <MultiSelectDialog.Preview<TMultiSelectDialogFormFields>
            {...args}
            onAdd={() => setOpenDialog(open => !open)}
            control={control}
            name="monitors"
          />
        }
      >
        <button className="c-map-card__back-button mb-4" onClick={() => setOpenDialog(open => !open)} />
        <MultiSelectDialog<TMultiSelectDialogFormFields> groups={args.groups} control={control} name="monitors" />
      </OptionalWrapper>
    </div>
  );
};

export const Standard = EmptyTemplate.bind({});
Standard.args = {
  groups: [
    {
      label: "Default",
      options: [{ value: "Me", label: "Myself (Default)" }]
    },
    {
      label: "Team 1",
      options: [
        { value: "1", label: "Paula Storm" },
        { value: "2", label: "Horacio Cruz" },
        { value: "3", label: "Tom Cortes" },
        { value: "4", label: "Emilia Cuaron" }
      ]
    },
    {
      label: "Team 2",
      options: [
        { value: "5", label: "Paula Storm" },
        { value: "6", label: "Horacio Cruz" },
        { value: "7", label: "Tom Cortes" },
        { value: "8", label: "Emilia Cuaron" }
      ]
    }
  ]
};

export const Populated = Template.bind({});
Populated.args = {
  ...Standard.args
};

export const EmptyPreview = EmptyPreviewTemplate.bind({});
EmptyPreview.args = {
  ...Standard.args,
  label: "Monitors",
  addButtonLabel: "Add Monitor",
  emptyLabel: "No Monitors Selected",
  emptyIcon: "white-foot"
};

export const PopulatedPreview = PreviewTemplate.bind({});
PopulatedPreview.args = {
  ...EmptyPreview.args
};

export const AsDialog = Combined.bind({});
AsDialog.args = {
  ...PopulatedPreview.args
};
