import { TAvailableTypes } from "components/modals/FormModal";
import { IFilter } from "components/ui/DataFilter/DataFilter";
import { ALL_VALUE, filterByTimeFrame, getTimeFrames } from "helpers/table";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { TGetAllAnswers, TGetTemplates } from "services/reports";
import { Option } from "types/select";
import { TFilterFields } from "./Reports";

const useReportFilters = (answers: TGetAllAnswers["data"] = [], templates: TGetTemplates["data"] = []) => {
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
    const uniqueUsers = answers
      .map(answer => {
        const template = templates.find(t => t.id === answer.attributes?.report);
        const names = (template?.attributes.name as any) ?? {};
        return {
          label: template
            ? names[template.attributes.defaultLanguage as keyof typeof names]
            : answer.attributes?.report ?? "", // Convert to template name
          value: answer.attributes?.report ?? ""
        };
      })
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index);

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniqueUsers];
  }, [answers, intl, templates]);

  const timeFrameOptions = useMemo<Option[]>(() => getTimeFrames(intl), [intl]);

  const alertTypeOptions = useMemo<Option[]>(() => {
    const uniqueAlerts = answers
      .map(answer => ({
        label: intl.formatMessage({
          id: `layers.${answer.attributes?.layer}`,
          defaultMessage: answer.attributes?.layer ?? ""
        }),
        value: answer.attributes?.layer ?? ""
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
          if (!value || value === ALL_VALUE) {
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
          return filterByTimeFrame(item.createdAt, value);
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
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.alertType === value;
          }
        }
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
        }
      }
    ];
  }, [alertTypeOptions, intl, usernameOptions]);

  return { filters, extraFilters };
};

export default useReportFilters;
