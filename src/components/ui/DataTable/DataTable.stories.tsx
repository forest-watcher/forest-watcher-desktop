import DataTable from "./DataTable";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "UI/DataTable",
  component: DataTable
} as ComponentMeta<typeof DataTable>;

const Template: ComponentStory<typeof DataTable> = args => {
  return <DataTable {...args} />;
};

export const Standard = Template.bind({});
Standard.args = {
  rows: [
    {
      name: "Foo",
      email: "foo@user.com"
    },
    {
      name: "Bar",
      email: "bar@user.com"
    }
  ],
  columnOrder: ["name", "email"]
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  ...Standard.args,
  className: "u-w-100"
};

export const WithActions = Template.bind({});
WithActions.args = {
  ...Standard.args,
  rowActions: [
    {
      name: "Edit",
      onClick: () => {}
    },
    {
      name: "Delete",
      onClick: () => {}
    }
  ]
};
