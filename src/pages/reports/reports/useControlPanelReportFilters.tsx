import { TAvailableTypes } from "components/modals/FormModal";
import { IFilter } from "components/ui/DataFilter/DataFilter";
import { IAlertIdentifier } from "constants/alerts";
import { AnswersResponse } from "generated/core/coreResponses";
import { getReportAlertsByName } from "helpers/reports";
import { ALL_VALUE, filterByTimeFrame, getTimeFrames } from "helpers/table";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { Option } from "types/select";
import { TFilterFields } from "./Reports";

const useControlPanelReportFilters = (answers: AnswersResponse["data"] = []) => {
  const intl = useIntl();

  const templateOptions = useMemo<Option[]>(() => {
    const uniqueTemplates = answers
      .map(answer => ({
        // @ts-ignore
        label: answer.attributes?.templateName ?? "",
        // @ts-ignore
        value: answer.attributes?.templateName ?? ""
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index && value.value !== "");

    return [{ label: intl.formatMessage({ id: "filters.all.templates" }), value: ALL_VALUE }, ...uniqueTemplates];
  }, [answers, intl]);

  const timeFrameOptions = useMemo<Option[]>(() => getTimeFrames(intl, "filters.all.timeframes"), [intl]);

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

    return [{ label: intl.formatMessage({ id: "filters.all.alerts" }), value: ALL_VALUE }, ...uniqueAlerts];
  }, [answers, intl]);

  const usernameOptions = useMemo<Option[]>(() => {
    const uniqueUsers = answers
      .map(answer => ({
        label: answer.attributes?.fullName ?? "",
        value: answer.attributes?.fullName ?? ""
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index);

    return [{ label: intl.formatMessage({ id: "filters.all.monitors" }), value: ALL_VALUE }, ...uniqueUsers];
  }, [answers, intl]);

  const filters = useMemo<IFilter<TAvailableTypes<TFilterFields>, any>[]>(() => {
    return [
      {
        name: "filter.by.alertType",
        filterOptions: {
          id: "alertType",
          hideLabel: true,
          selectProps: {
            placeholder: intl.formatMessage({ id: "alertType.filterBy" }),
            options: alertTypeOptions,
            label: intl.formatMessage({ id: "alertType.name" }),
            defaultValue: alertTypeOptions[0],
            scrollOnOpen: true
          },
          registerProps: {
            name: "alertType"
          }
        },
        filterCallback: (item, value) => {
          const alerts = getReportAlertsByName(item.attributes?.reportName);
          if (alerts.length === 0 && value === "none") {
            return true;
          }

          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return Boolean(alerts.find((alert: IAlertIdentifier) => alert.id === value));
          }
        },
        getShouldShow: () => alertTypeOptions.length > 2
      },
      {
        name: "filter.by.template",
        filterOptions: {
          id: "template",
          selectProps: {
            placeholder: intl.formatMessage({ id: "templates.filterBy" }),
            options: templateOptions,
            label: intl.formatMessage({ id: "templates.name" }),
            defaultValue: templateOptions[0],
            scrollOnOpen: true
          },
          hideLabel: true,
          registerProps: {
            name: "template"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.attributes.templateName === value;
          }
        },
        getShouldShow: () => alertTypeOptions.length > 2
      },
      {
        name: "filter.by.timeframe",
        filterOptions: {
          id: "timeframe",
          selectProps: {
            placeholder: intl.formatMessage({ id: "timeframe.filterBy" }),
            options: timeFrameOptions,
            label: intl.formatMessage({ id: "timeframe.name" }),
            defaultValue: timeFrameOptions[0],
            scrollOnOpen: true
          },
          hideLabel: true,
          registerProps: {
            name: "timeFrame"
          }
        },
        filterCallback: (item, value) => {
          return filterByTimeFrame(item.attributes.createdAt, value);
        }
      },
      {
        name: "filter.by.submittedBy",
        filterOptions: {
          id: "submittedBy",
          selectProps: {
            placeholder: intl.formatMessage({ id: "submittedBy.filterBy" }),
            options: usernameOptions,
            label: intl.formatMessage({ id: "submittedBy.name" }),
            defaultValue: usernameOptions[0],
            scrollOnOpen: true
          },
          hideLabel: true,
          registerProps: {
            name: "submittedBy"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.attributes.fullName === value;
          }
        },
        getShouldShow: () => alertTypeOptions.length > 2
      }
    ];
  }, [alertTypeOptions, intl, templateOptions, timeFrameOptions, usernameOptions]);

  return { filters };
};

export default useControlPanelReportFilters;
