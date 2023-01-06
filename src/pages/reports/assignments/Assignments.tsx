import LoadingWrapper from "components/extensive/LoadingWrapper";
import Article from "components/layouts/Article";
import DataFilter from "components/ui/DataFilter/DataFilter";
import DataTable from "components/ui/DataTable/DataTable";
import { useGetV3GfwAreasUserandteam, useGetV3GfwUser } from "generated/core/coreComponents";
import { getAlertText, priorityToString } from "helpers/assignments";
import { sortByDateString, sortByString } from "helpers/table";
import { useAccessToken } from "hooks/useAccessToken";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useAssignmentsFilters from "./useAssignmentsFilter";
import ExportModal, { TExportForm } from "components/modals/exports/ExportModal";
import { Link, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { UnpackNestedValue } from "react-hook-form";
import { AREA_EXPORT_FILE_TYPES, ASSIGNMENT_FIELDS } from "constants/export";
import { usePostV3ExportsAssignmentsExportSome } from "generated/exports/exportsComponents";
import { toastr } from "react-redux-toastr";
import { Url } from "generated/exports/exportsResponses";
import { delay } from "services/exports";

export type TAssignmentsDataTable = {
  id: string;
  createdAt: string;
  name: string;
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

  /**
   * * Get User's Assignments
   */
  const { data: assignmentsData, isLoading: assignmentsLoading } = useGetV3GfwUser(
    { headers: httpAuthHeader },
    { cacheTime: 0, retryOnMount: true }
  );

  /**
   * * Get the user's areas (and team areas)
   */
  const { data: areaData, isLoading: areasLoading } = useGetV3GfwAreasUserandteam({ headers: httpAuthHeader });

  /**
   * * Export reports
   */
  const { mutateAsync: exportReport } = usePostV3ExportsAssignmentsExportSome();

  /**
   * * Hide Assignments that don't have an area available to the user.
   */
  const availableAssignments = useMemo(() => {
    return assignmentsData?.data?.filter(assignment =>
      areaData?.data?.find(area => area.id === assignment.attributes?.areaId)
    );
  }, [areaData?.data, assignmentsData?.data]);

  const rows = useMemo<TAssignmentsDataTable[]>(() => {
    if (!availableAssignments) {
      return [];
    }

    return availableAssignments.map(assignment => {
      const area = areaData?.data?.find(area => area.id === assignment.attributes?.areaId);
      return {
        id: assignment.id ?? "",
        createdAt: assignment.attributes?.createdAt ?? "",
        name: assignment.attributes?.name,
        area: area?.attributes?.name ?? assignment.attributes?.areaId ?? "-",
        areaId: assignment.attributes?.areaId,
        alertType: getAlertText(assignment, intl),
        priority: intl.formatMessage({ id: priorityToString(assignment.attributes?.priority) }),
        status: intl.formatMessage({ id: `assignment.details.status.${assignment.attributes?.status ?? ""}` }),
        statusValue: assignment.attributes?.status
      };
    }) as TAssignmentsDataTable[];
  }, [areaData?.data, availableAssignments, intl]);

  const [filteredRows, setFilteredRows] = useState<TAssignmentsDataTable[]>(rows);
  const { filters, extraFilters } = useAssignmentsFilters(availableAssignments, areaData);

  const handleExport = useCallback(
    async (values: UnpackNestedValue<TExportForm>) => {
      const checkStatus = (id: string): Promise<Url> => {
        return new Promise(async (resolve, reject) => {
          let hasFinished = false;

          try {
            do {
              const resp = await fetch(`${process.env.REACT_APP_API_CUBE_URL}/v3/exports/assignments/${id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...httpAuthHeader
                }
              });

              const body: Url = await resp.json();
              if (body.data) {
                hasFinished = true;
                resolve(body as Url);
              }
              await delay(3000);
            } while (!hasFinished);
          } catch (err) {
            reject(err);
          }
        });
      };

      // Do request
      try {
        const { data } = await exportReport({
          body: {
            ...values,
            fields: ASSIGNMENT_FIELDS,
            // @ts-ignore incorrect typings in docs
            ids: selectedAssignments.length
              ? selectedAssignments.map(a => a.id)
              : assignmentsData?.data?.map(a => a.id) || []
          },
          headers: httpAuthHeader
        });

        const urlResp = await checkStatus(data || "");
        return urlResp.data;
      } catch (err) {
        // Do toast
        toastr.error(intl.formatMessage({ id: "export.error" }), "");
      }
    },
    [assignmentsData?.data, exportReport, httpAuthHeader, intl, selectedAssignments]
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
              {
                key: "name",
                name: "assignments.table.name",
                sortCompareFn: sortByDateString,
                rowCellClassNames: "min-w-[120px]"
              },
              { key: "area", name: "assignments.table.area", sortCompareFn: sortByString },
              {
                key: "alertType",
                name: "assignments.table.alertType",
                sortCompareFn: sortByString
              },
              { key: "status", name: "assignments.table.status", sortCompareFn: sortByString },
              { key: "priority", name: "assignments.table.priority", sortCompareFn: sortByString },
              {
                key: "id",
                name: "   ",
                rowLabel: () => intl.formatMessage({ id: "common.view" }),
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
            onClose={() => history.push(`/reporting/assignments`)}
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
