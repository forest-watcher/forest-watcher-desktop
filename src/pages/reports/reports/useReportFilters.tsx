import { TAvailableTypes } from "components/modals/FormModal";
import { IFilter } from "components/ui/DataFilter/DataFilter";
import { IAlertIdentifier } from "constants/alerts";
import { getReportAlertsByName } from "helpers/reports";
import { ALL_VALUE, filterByTimeFrame, getTimeFrames } from "helpers/table";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { TGetAllAnswers } from "services/reports";
import { Option } from "types/select";
import { TFilterFields } from "./Reports";

const useReportFilters = (
  answers: TGetAllAnswers["data"] = [],
  defaultTemplateFilter: string | null | undefined = ""
) => {
  const intl = useIntl();

  const areaFilterOptions = useMemo<Option[]>(() => {
    const uniqueAreas = answers
      .map(answer => ({
        label: answer.attributes?.areaOfInterestName ?? "",
        value: answer.attributes?.areaOfInterestName ?? ""
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index);

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniqueAreas];
  }, [answers, intl]);

  const templateOptions = useMemo<Option[]>(() => {
    const uniqueTemplates = answers
      .map(answer => ({
        // @ts-ignore
        label: answer.attributes?.templateName ?? "",
        // @ts-ignore
        value: answer.attributes?.templateName ?? ""
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index && value.value !== "");

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniqueTemplates];
  }, [answers, intl]);

  const timeFrameOptions = useMemo<Option[]>(() => getTimeFrames(intl), [intl]);

  const alertTypeOptions = useMemo<Option[]>(() => {
    const allAlerts = answers
      .map(answer => {
        const alerts = getReportAlertsByName(answer.attributes?.reportName);
        if (alerts.length === 0) {
          return "none";
        }
        return alerts.map(alert => alert.id);
      })
      .flat();

    const uniqueAlerts = allAlerts
      .map(id => ({
        label: intl.formatMessage({
          id: `layers.${id}`,
          defaultMessage: id
        }),
        value: id
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index);

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniqueAlerts];
  }, [answers, intl]);

  const usernameOptions = useMemo<Option[]>(() => {
    const uniqueUsers = answers
      .map(answer => ({
        label: answer.attributes?.fullName ?? "",
        value: answer.attributes?.fullName ?? ""
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index);

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniqueUsers];
  }, [answers, intl]);

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
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.area === value;
          }
        },
        getShouldShow: () => areaFilterOptions.length > 2
      },
      {
        name: "filter.by.template",
        filterOptions: {
          id: "template",
          selectProps: {
            placeholder: intl.formatMessage({ id: "templates.filterBy" }),
            options: templateOptions,
            label: intl.formatMessage({ id: "templates.name" }),
            defaultValue: defaultTemplateFilter
              ? templateOptions.find(option => option.value === defaultTemplateFilter) || templateOptions[0]
              : templateOptions[0]
          },
          variant: "simple-green",
          registerProps: {
            name: "template"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.template === value;
          }
        },
        getShouldShow: () => templateOptions.length > 2
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
          return filterByTimeFrame(item.createdAt, value);
        }
      }
    ];
  }, [areaFilterOptions, defaultTemplateFilter, intl, templateOptions, timeFrameOptions]);

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
          if (item.alerts.length === 0 && value === "none") {
            return true;
          }

          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.alerts.find((alert: IAlertIdentifier) => alert.id === value);
          }
        },
        getShouldShow: () => alertTypeOptions.length > 2
      },
      // {
      //   name: "toggle.voice",
      //   filterOptions: {
      //     id: "voice",
      //     toggleProps: {
      //       label: intl.formatMessage({ id: "voiceRecordings.toggleBy" })
      //     },
      //     registerProps: {
      //       name: "voice"
      //     }
      //   },
      //   filterCallback: (item, value) => {
      //     if (!value) {
      //       return true;
      //     } else {
      //       return item.name === "Foo";
      //     }
      //   }
      // }, Filtering by voice in next phase of work
      {
        name: "filter.by.submittedBy",
        filterOptions: {
          id: "submittedBy",
          selectProps: {
            placeholder: intl.formatMessage({ id: "submittedBy.filterBy" }),
            options: usernameOptions,
            label: intl.formatMessage({ id: "submittedBy.name" }),
            defaultValue: usernameOptions[0]
          },
          registerProps: {
            name: "submittedBy"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.monitor === value;
          }
        },
        getShouldShow: () => alertTypeOptions.length > 2
      }
    ];
  }, [alertTypeOptions, intl, usernameOptions]);

  return { filters, extraFilters };
};

export default useReportFilters;
