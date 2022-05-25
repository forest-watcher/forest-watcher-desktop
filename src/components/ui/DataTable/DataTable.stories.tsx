import DataTable from "./DataTable";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "UI/DataTable",
  component: DataTable
} as ComponentMeta<typeof DataTable>;

type TDataTableRows = {
  name: string;
  email: string;
};

// Parsing error from prettier below... Although it's valid syntax
// eslint-disable-next-line prettier/prettier
const Template: ComponentStory<typeof DataTable<TDataTableRows>> = args => <DataTable<TDataTableRows> {...args} />;

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
