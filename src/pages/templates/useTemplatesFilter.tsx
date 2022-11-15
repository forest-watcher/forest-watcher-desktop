import { useMemo } from "react";
import { useIntl } from "react-intl";
import { Option } from "types/select";
import { TemplatesFilterFields, TemplateTableRowData } from "./Templates";
import { ALL_VALUE } from "helpers/table";
import { IFilter } from "components/ui/DataFilter/DataFilter";
import { TAvailableTypes } from "components/modals/FormModal";

const useTemplatesFilter = (templates: TemplateTableRowData[] = []) => {
  const intl = useIntl();

  const areaFilterOptions = useMemo<Option[]>(() => {
    const uniqueAreas = templates
      .map(template => ({
        label: template.area ?? "",
        value: template.area ?? ""
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index)
      .filter(area => area.value);

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniqueAreas];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, intl]);

  const filters = useMemo<IFilter<TAvailableTypes<TemplatesFilterFields>, any>[]>(() => {
    return [
      {
        name: "filter.by.area",
        filterOptions: {
          id: "area",
          selectProps: {
            placeholder: intl.formatMessage({ id: "areas.filterBy" }),
            options: areaFilterOptions,
            label: intl.formatMessage({ id: "areas.name" }),
            defaultValue: areaFilterOptions[0]
          },
          variant: "simple-green",
          registerProps: {
            name: "area"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.area === value;
          }
        },
        getShouldShow: () => areaFilterOptions.length > 2
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaFilterOptions, intl]);

  const search = useMemo<IFilter<TAvailableTypes<TemplatesFilterFields>, any>>(() => {
    return {
      name: "Search",
      filterOptions: {
        registerProps: {
          name: "search"
        },
        id: "search",
        htmlInputProps: {
          type: "text",
          placeholder: intl.formatMessage({ id: "templates.search.placeholder" }),
          label: intl.formatMessage({ id: "filters.search" })
        }
      },
      filterCallback: (item, value) => {
        const values: any[] = Object.values(item).map((val: any) => val.toLowerCase());
        return values.some(x => x.includes(value));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { filters, search };
};

export default useTemplatesFilter;
