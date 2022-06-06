import DataTable, { IProps as IDataTableProps } from "./DataTable";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { FC } from "react";

export default {
  title: "UI/DataTable",
  component: DataTable
} as ComponentMeta<typeof DataTable>;

type TDataTableRows = {
  name: string;
  email: string;
};

const Template =
  <T extends { [key: string]: string }>(): ComponentStory<FC<IDataTableProps<T>>> =>
  args =>
    <DataTable<T> {...args} />;

export const Standard = Template<TDataTableRows>().bind({});
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
  columnOrder: [
    { key: "name", name: "teams.teamName" },
    { key: "email", name: "teams.findByEmail" }
  ]
};

export const FullWidth = Template<TDataTableRows>().bind({});
FullWidth.args = {
  ...Standard.args,
  className: "u-w-100"
};

export const WithActions = Template<TDataTableRows>().bind({});
WithActions.args = {
  ...FullWidth.args,
  rowActions: [
    {
      name: "common.edit",
      onClick: () => {}
    },
    {
      name: "common.delete",
      onClick: () => {}
    }
  ]
};
