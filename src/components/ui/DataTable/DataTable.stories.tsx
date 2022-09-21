import DataTable, { IProps as IDataTableProps } from "./DataTable";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { FC } from "react";
import { sortByDateString, sortByString } from "helpers/table";

export default {
  title: "UI/DataTable",
  component: DataTable
} as ComponentMeta<typeof DataTable>;

type TDataTableRows = {
  name: string;
  email: string;
  createdDate: string;
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
      email: "foo@user.com",
      createdDate: "1995-12-17T03:24:00"
    },
    {
      name: "Bar",
      email: "bar@user.com",
      createdDate: "2022-05-17T12:22:00"
    }
  ],
  columnOrder: [
    { key: "name", name: "teams.teamName", sortCompareFn: sortByString },
    { key: "email", name: "teams.findByEmail" },
    {
      key: "createdDate",
      name: "common.createdDate",
      rowLabel: (row, value) =>
        value && !Array.isArray(value)
          ? new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit", year: "numeric" }).format(
              new Date(value)
            )
          : "",
      sortCompareFn: sortByDateString
    }
  ],
  onSelect: undefined
};

export const FullWidth = Template<TDataTableRows>().bind({});
FullWidth.args = {
  ...Standard.args,
  className: "u-w-100"
};

export const Selectable = Template<TDataTableRows>().bind({});
Selectable.args = {
  ...Standard.args,
  className: "u-w-100",
  onSelect: (selected: TDataTableRows[]) => console.log(selected),
  selectFindGetter: "email"
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
      email: "foo@user.com",
      createdDate: "1995-12-17T03:24:00"
    },
    {
      name: "Bar",
      email: "bar@user.com",
      createdDate: "1996-12-17T03:24:00"
    },
    {
      name: "Baz",
      email: "baz@user.com",
      createdDate: "1997-12-17T03:24:00"
    },
    {
      name: "Fizz",
      email: "fizz@user.com",
      createdDate: "1998-12-17T03:24:00"
    },
    {
      name: "Pop",
      email: "pop@user.com",
      createdDate: "2021-12-17T03:24:00"
    },
    {
      name: "Bubble",
      email: "bubble@user.com",
      createdDate: "2000-12-17T03:24:00"
    },
    {
      name: "Squek",
      email: "Squek@user.com",
      createdDate: "2001-12-17T03:24:00"
    },
    {
      name: "Bang",
      email: "bang@user.com",
      createdDate: "2002-12-17T03:24:00"
    },
    {
      name: "Hiya",
      email: "hiya@user.com",
      createdDate: "2003-12-17T03:24:00"
    },
    {
      name: "Too",
      email: "too@user.com",
      createdDate: "2004-12-17T03:24:00"
    },
    {
      name: "Many",
      email: "many@user.com",
      createdDate: "2008-12-17T03:24:00"
    },
    {
      name: "Names",
      email: "names@user.com",
      createdDate: "2006-12-17T03:24:00"
    },
    {
      name: "To",
      email: "to@user.com",
      createdDate: "2007-12-17T03:24:00"
    },
    {
      name: "Come",
      email: "come@user.com",
      createdDate: "2008-12-17T03:24:00"
    },
    {
      name: "Up",
      email: "up@user.com",
      createdDate: "1984-12-17T03:24:00"
    },
    {
      name: "With",
      email: "with@user.com",
      createdDate: "2010-12-17T03:24:00"
    }
  ]
};
