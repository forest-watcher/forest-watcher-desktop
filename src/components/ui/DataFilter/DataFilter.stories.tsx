import DataFilter, { IFilter } from "./DataFilter";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TAvailableTypes } from "components/modals/FormModal";
import { useState } from "react";

export default {
  title: "UI/DataFilter",
  component: DataFilter
} as ComponentMeta<typeof DataFilter>;

type TOptionType = {
  name: string;
  email: string;
};

type TFormFields = {
  name: string;
  foo: boolean;
};

const options = [
  {
    name: "Hey",
    email: "hey@user.com"
  },
  {
    name: "Foo",
    email: "Foo@user.com"
  },
  {
    name: "Bar",
    email: "Bar@user.com"
  }
];

const selectOptions = [
  { label: "All", value: "any" },
  ...options.map(item => ({ label: item.name, value: item.name }))
];

const filters: IFilter<TAvailableTypes<TFormFields>, TOptionType>[] = [
  {
    name: "filter.by.name",
    filterOptions: {
      id: "listofthings",
      selectProps: {
        placeholder: "Filter by name",
        options: selectOptions,
        label: "Name",
        defaultValue: selectOptions[0]
      },
      variant: "simple-green",
      registerProps: {
        name: "name"
      }
    },
    filterCallback: (item, value) => {
      if (!value || value === "any") {
        return true;
      } else {
        return item.name === value;
      }
    }
  },
  {
    name: "toggle.foo",
    filterOptions: {
      id: "toggle",
      toggleProps: {
        label: "Only Foo"
      },
      registerProps: {
        name: "foo"
      }
    },
    filterCallback: (item, value) => {
      if (!value) {
        return true;
      } else {
        return item.name === "Foo";
      }
    }
  }
];

const Template: ComponentStory<typeof DataFilter> = args => {
  const [filteredOptions, setFilteredOptions] = useState(options);

  const onChange = (options: TOptionType[]) => {
    setFilteredOptions(options);
  };

  return (
    <>
      {/* @ts-ignore Seems to be fine being used in the application. */}
      <DataFilter<TFormFields, TOptionType> {...args} onFiltered={onChange} options={options} />
      <pre className="u-margin-top">
        <code>{JSON.stringify(filteredOptions, null, 2)}</code>
      </pre>
    </>
  );
};

export const Standard = Template.bind({});
// @ts-ignore
Standard.args = { filters };
