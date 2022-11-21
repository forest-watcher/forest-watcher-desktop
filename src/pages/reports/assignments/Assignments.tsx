import LoadingWrapper from "components/extensive/LoadingWrapper";
import Article from "components/layouts/Article";
import Button from "components/ui/Button/Button";
import DataFilter from "components/ui/DataFilter/DataFilter";
import DataTable from "components/ui/DataTable/DataTable";
import { useGetV3GfwAreasUserandteam, useGetV3GfwUser } from "generated/core/coreComponents";
import { priorityToString } from "helpers/assignments";
import { sortByDateString, sortByString } from "helpers/table";
import { useAccessToken } from "hooks/useAccessToken";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useAssignmentsFilters from "./useAssignmentsFilter";
import ExportModal, { TExportForm } from "components/modals/exports/ExportModal";
import { Link, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { UnpackNestedValue } from "react-hook-form";
import { AREA_EXPORT_FILE_TYPES } from "constants/export";
import { usePostV3ExportsAssignmentsExportSome } from "generated/exports/exportsComponents";

export type TAssignmentsDataTable = {
  id: string;
  createdAt: string;
  area: string;
  alertType: any;
  status: string;
  priority: string;
};

export type TAssignmentsFilterFields = {
  area: string;
  status: string;
  timeFrame: string;
  alertType: string;
  priority: string;
};

const Assignments = () => {
  const intl = useIntl();
  const { httpAuthHeader } = useAccessToken();
  const [selectedAssignments, setSelectedAssignments] = useState<TAssignmentsDataTable[]>([]);
  const { path, url } = useRouteMatch();
  const history = useHistory();

  // Queries - Get User's Assignments
  const { data: assignmentsData, isLoading: assignmentsLoading } = useGetV3GfwUser(
    { headers: httpAuthHeader },
    { cacheTime: 0, retryOnMount: true }
  );

  const { mutateAsync: exportReport } = usePostV3ExportsAssignmentsExportSome();
  const { data: areaData, isLoading: areasLoading } = useGetV3GfwAreasUserandteam({ headers: httpAuthHeader });

  const rows = useMemo<TAssignmentsDataTable[]>(() => {
    if (!assignmentsData?.data) {
      return [];
    }

    return assignmentsData?.data?.map(assignment => {
      const area = areaData?.data?.find(area => area.id === assignment.attributes?.areaId);
      return {
        id: assignment.id ?? "",
        createdAt: assignment.attributes?.createdAt ?? "",
        area: area?.attributes?.name ?? "-",
        alertType: assignment.attributes?.location ?? [],
        priority: intl.formatMessage({ id: priorityToString(assignment.attributes?.priority) }),
        status: assignment.attributes?.status.toUpperCase() ?? ""
      };
    }) as TAssignmentsDataTable[];
  }, [areaData?.data, assignmentsData?.data, intl]);

  const [filteredRows, setFilteredRows] = useState<TAssignmentsDataTable[]>(rows);
  const { filters, extraFilters } = useAssignmentsFilters(assignmentsData?.data);

  const handleExport = useCallback(
    async (values: UnpackNestedValue<TExportForm>) => {
      await exportReport({});
      // Do request
      // try {
      //   const { data } = await exportService.exportArea(area.id, values.fileType, values.email);
      //   return data;
      // } catch (err) {
      //   // Do toast
      //   toastr.error(intl.formatMessage({ id: "export.error" }), "");
      // }
    },
    [intl]
  );

  return (
    <div className="l-content">
      <LoadingWrapper loading={assignmentsLoading || areasLoading}>
        <Article
          title="reporting.tabs.assignments"
          size="small"
          actions={
            <Link to={`${url}/export`} className="c-button c-button--primary">
              <FormattedMessage id={selectedAssignments.length > 0 ? "export.selected" : "export.all"} />
            </Link>
          }
        >
          <DataFilter
            filters={filters}
            extraFilters={extraFilters}
            onFiltered={(resp: TAssignmentsDataTable[]) => setFilteredRows(resp)}
            options={rows}
            className="c-data-filter--above-table"
          />
          <DataTable
            className="u-w-100"
            rows={filteredRows}
            isPaginated
            onSelect={setSelectedAssignments}
            selectFindGetter="id"
            columnOrder={[
              {
                key: "createdAt",
                name: "assignments.table.createdAt",
                rowLabel: (row, value) => {
                  return !Array.isArray(value)
                    ? intl.formatDate(value, { day: "2-digit", month: "2-digit", year: "2-digit" })
                    : "";
                },
                sortCompareFn: sortByDateString
              },
              { key: "area", name: "assignments.table.area", sortCompareFn: sortByString },
              {
                key: "alertType",
                name: "assignments.table.alertType",
                rowLabel: (row, value) => {
                  if (!Array.isArray(value)) {
                    return "";
                  }
                  if (value.length === 0) {
                    return intl.formatMessage({ id: "layers.none" });
                  }

                  const valueStr = value
                    .map(alert => (alert.alertType ? intl.formatMessage({ id: `layers.${alert.alertType}` }) : ""))
                    .filter(name => name !== "")
                    .join(", ");

                  return valueStr.length ? valueStr : intl.formatMessage({ id: "layers.none" });
                },
                sortCompareFn: (a, b, direction) => {
                  const newA = intl.formatMessage({ id: `layers.${a}`, defaultMessage: a?.toString() });
                  const newB = intl.formatMessage({ id: `layers.${b}`, defaultMessage: b?.toString() });

                  return sortByString(newA, newB, direction);
                }
              },
              { key: "status", name: "assignments.table.status", sortCompareFn: sortByString },
              { key: "priority", name: "assignments.table.priority", sortCompareFn: sortByString },
              {
                key: "id",
                name: "   ",
                rowLabel: () => "View",
                rowHref: ({ id }) => `/assignment/${id}`,
                rowHrefClassNames: "text-primary-500 font-medium uppercase",
                rowCellClassNames: "!text-right"
              }
            ]}
          />
        </Article>
      </LoadingWrapper>
      <Switch>
        <Route path={`${path}/export`}>
          <ExportModal
            onSave={handleExport}
            onClose={() => history.goBack()}
            isOpen
            fileTypes={AREA_EXPORT_FILE_TYPES}
            fields={[]}
          />
        </Route>
      </Switch>
    </div>
  );
};

export default Assignments;
