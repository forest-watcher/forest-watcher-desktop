import { TAvailableTypes } from "components/modals/FormModal";
import { IFilter } from "components/ui/DataFilter/DataFilter";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { Option } from "types/select";
import { TFilterFields } from "./Reports";

const useReportFilters = () => {
  const intl = useIntl();

  const areaFilterOptions = useMemo<Option[]>(
    () => [{ label: intl.formatMessage({ id: "common.all" }), value: "all" }],
    [intl]
  );

  const templateOptions = useMemo<Option[]>(
    () => [{ label: intl.formatMessage({ id: "common.all" }), value: "all" }],
    [intl]
  );

  const timeFrameOptions = useMemo<Option[]>(
    () => [{ label: intl.formatMessage({ id: "common.all" }), value: "all" }],
    [intl]
  );

  const alertTypeOptions = useMemo<Option[]>(
    () => [{ label: intl.formatMessage({ id: "common.all" }), value: "all" }],
    [intl]
  );

  const filters = useMemo<IFilter<TAvailableTypes<TFilterFields>, any>[]>(() => {
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
          if (!value || value === "any") {
            return true;
          } else {
            return item.area === value;
          }
        }
      },
      {
        name: "filter.by.template",
        filterOptions: {
          id: "template",
          selectProps: {
            placeholder: intl.formatMessage({ id: "templates.filterBy" }),
            options: templateOptions,
            label: intl.formatMessage({ id: "templates.name" }),
            defaultValue: templateOptions[0]
          },
          variant: "simple-green",
          registerProps: {
            name: "template"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === "any") {
            return true;
          } else {
            return item.template === value;
          }
        }
      },
      {
        name: "filter.by.timeframe",
        filterOptions: {
          id: "timeframe",
          selectProps: {
            placeholder: intl.formatMessage({ id: "timeframe.filterBy" }),
            options: timeFrameOptions,
            label: intl.formatMessage({ id: "timeframe.name" }),
            defaultValue: timeFrameOptions[0]
          },
          variant: "simple-green",
          registerProps: {
            name: "timeFrame"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === "any") {
            return true;
          } else {
            return item.area === value; // TODO: Build timeframe callback
          }
        }
      }
    ];
  }, [areaFilterOptions, intl, templateOptions, timeFrameOptions]);

  const extraFilters = useMemo<IFilter<TAvailableTypes<TFilterFields>, any>[]>(() => {
    return [
      {
        name: "filter.by.alertType",
        filterOptions: {
          id: "alertType",
          selectProps: {
            placeholder: intl.formatMessage({ id: "alertType.filterBy" }),
            options: alertTypeOptions,
            label: intl.formatMessage({ id: "alertType.name" }),
            defaultValue: alertTypeOptions[0]
          },
          registerProps: {
            name: "alertType"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === "any") {
            return true;
          } else {
            return item.area === value;
          }
        }
      },
      {
        name: "toggle.voice",
        filterOptions: {
          id: "voice",
          toggleProps: {
            label: intl.formatMessage({ id: "voiceRecordings.toggleBy" })
          },
          registerProps: {
            name: "voice"
          }
        },
        filterCallback: (item, value) => {
          if (!value) {
            return true;
          } else {
            return item.name === "Foo";
          }
        }
      },
      {
        name: "filter.by.submittedBy",
        filterOptions: {
          id: "submittedBy",
          selectProps: {
            placeholder: intl.formatMessage({ id: "submittedBy.filterBy" }),
            options: alertTypeOptions,
            label: intl.formatMessage({ id: "submittedBy.name" }),
            defaultValue: alertTypeOptions[0]
          },
          registerProps: {
            name: "submittedBy"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === "any") {
            return true;
          } else {
            return item.area === value;
          }
        }
      }
    ];
  }, []);

  return { filters, extraFilters };
};

export default useReportFilters;
