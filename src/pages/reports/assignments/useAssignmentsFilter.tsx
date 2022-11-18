import { TAvailableTypes } from "components/modals/FormModal";
import { IFilter } from "components/ui/DataFilter/DataFilter";
import { AssignmentsResponse } from "generated/core/coreResponses";
import { priorityToString } from "helpers/assignments";
import { ALL_VALUE, filterByTimeFrame, getTimeFrames } from "helpers/table";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { Option } from "types/select";
import { TAssignmentsFilterFields } from "./Assignments";

const useReportFilters = (assignments: AssignmentsResponse["data"] = []) => {
  const intl = useIntl();

  const areaFilterOptions = useMemo<Option[]>(() => {
    const uniqueAreas = assignments
      .map(assignment => ({
        label: assignment.attributes?.areaName ?? "",
        value: assignment.attributes?.areaName ?? ""
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index);

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniqueAreas];
  }, [assignments, intl]);

  const statusOptions = useMemo<Option[]>(() => {
    const uniqueStatuses = assignments
      .map(assignment => ({
        label: assignment.attributes?.status ?? "",
        value: assignment.attributes?.status ?? ""
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index);

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniqueStatuses];
  }, [assignments, intl]);

  const timeFrameOptions = useMemo<Option[]>(() => getTimeFrames(intl), [intl]);

  const alertTypeOptions = useMemo<Option[]>(() => {
    const allAlerts = assignments
      .map(assignment => {
        if (!assignment.attributes?.location || typeof assignment.attributes?.location === "string") return "none";
        return assignment.attributes?.location?.map(loc => loc.alertType ?? "none");
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
  }, [assignments, intl]);

  const priorityOptions = useMemo<Option[]>(() => {
    const uniquePriorities = assignments
      .map(assignment => ({
        label: intl.formatMessage({ id: priorityToString(assignment.attributes?.priority) }),
        value: intl.formatMessage({ id: priorityToString(assignment.attributes?.priority) })
      }))
      .filter((value, index, self) => self.findIndex(t => t.value === value.value) === index);

    return [{ label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE }, ...uniquePriorities];
  }, [assignments, intl]);

  const filters = useMemo<IFilter<TAvailableTypes<TAssignmentsFilterFields>, any>[]>(() => {
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
        name: "filter.by.status",
        filterOptions: {
          id: "status",
          selectProps: {
            placeholder: intl.formatMessage({ id: "templates.filterBy" }),
            options: statusOptions,
            label: intl.formatMessage({ id: "Status" }),
            defaultValue: statusOptions[0]
          },
          variant: "simple-green",
          registerProps: {
            name: "status"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.status === value;
          }
        },
        getShouldShow: () => statusOptions.length > 2
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
  }, [areaFilterOptions, intl, statusOptions, timeFrameOptions]);

  const extraFilters = useMemo<IFilter<TAvailableTypes<TAssignmentsFilterFields>, any>[]>(() => {
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
          if (typeof item.alertType === "string") return true;
          if (item.alertType.length === 0 && value === "none") {
            return true;
          }

          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.alertType.find((alert: any) => alert.alertType === value);
          }
        },
        getShouldShow: () => alertTypeOptions.length > 2
      },
      {
        name: "filter.by.priority",
        filterOptions: {
          id: "priority",
          selectProps: {
            placeholder: intl.formatMessage({ id: "assignments.priority.filterBy" }),
            options: priorityOptions,
            label: intl.formatMessage({ id: "assignments.table.priority" }),
            defaultValue: priorityOptions[0]
          },
          registerProps: {
            name: "priority"
          }
        },
        filterCallback: (item, value) => {
          if (!value || value === ALL_VALUE) {
            return true;
          } else {
            return item.priority === value;
          }
        }
      }
    ];
  }, [alertTypeOptions, priorityOptions, intl]);

  return { filters, extraFilters };
};

export default useReportFilters;
