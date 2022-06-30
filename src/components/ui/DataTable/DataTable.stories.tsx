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

export const WithPagination = Template<TDataTableRows>().bind({});
WithPagination.args = {
  ...FullWidth.args,
  isPaginated: true,
  rowsPerPage: 5,
  rows: [
    {
      name: "Foo",
      email: "foo@user.com"
    },
    {
      name: "Bar",
      email: "bar@user.com"
    },
    {
      name: "Baz",
      email: "baz@user.com"
    },
    {
      name: "Fizz",
      email: "fizz@user.com"
    },
    {
      name: "Pop",
      email: "pop@user.com"
    },
    {
      name: "Bubble",
      email: "bubble@user.com"
    },
    {
      name: "Squek",
      email: "Squek@user.com"
    },
    {
      name: "Bang",
      email: "bang@user.com"
    },
    {
      name: "Hiya",
      email: "hiya@user.com"
    },
    {
      name: "Too",
      email: "too@user.com"
    },
    {
      name: "Many",
      email: "many@user.com"
    },
    {
      name: "Names",
      email: "names@user.com"
    },
    {
      name: "To",
      email: "to@user.com"
    },
    {
      name: "Come",
      email: "come@user.com"
    },
    {
      name: "Up",
      email: "up@user.com"
    },
    {
      name: "With",
      email: "with@user.com"
    }
  ]
};
