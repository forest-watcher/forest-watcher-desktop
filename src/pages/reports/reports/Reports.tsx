import Article from "components/layouts/Article";
import DataFilter from "components/ui/DataFilter/DataFilter";
import DataTable from "components/ui/DataTable/DataTable";
import { useGetV3GfwTemplatesAllAnswers } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import useReportFilters from "./useReportFilters";
import Loader from "components/ui/Loader";
import EmptyState from "components/ui/EmptyState/EmptyState";
import EmptyStateIcon from "assets/images/icons/EmptyReports.svg";
import { sortByDateString, sortByString } from "helpers/table";
import DeleteRoute from "./actions/DeleteReportContainer";
import { getReportAlertsByName } from "helpers/reports";
import { IAlertIdentifier } from "constants/alerts";
import { UnpackNestedValue } from "react-hook-form";
import ExportModal, { TExportForm } from "components/modals/exports/ExportModal";
import { exportService } from "services/exports";
import { REPORT_EXPORT_FILE_TYPES } from "constants/export";
import { toastr } from "react-redux-toastr";
import useUrlQuery from "hooks/useUrlQuery";
import useGetUserId from "hooks/useGetUserId";
import { fireGAEvent } from "helpers/analytics";
import { MonitoringActions } from "types/analytics";

export type TReportsDataTable = {
  id: string;
  createdAt: string;
  monitor: string;
  alerts: IAlertIdentifier[];
  name: string;
  area: string;
  coordinates: string;
  template: string;
  templateId: string;
  userId?: string;
  view?: string;
};

export type TFilterFields = {
  area: string;
  template: string;
  timeFrame: string;
  submittedBy: string;
  alertType: string;
  voice: boolean;
};

interface IProps {}

const Reports: FC<IProps> = () => {
  let { path, url } = useRouteMatch();
  const history = useHistory();
  const [selectedReports, setSelectedReports] = useState<TReportsDataTable[]>([]);
  const urlQuery = useUrlQuery();
  const defaultTemplateFilter = useMemo(() => urlQuery.get("defaultTemplateFilter"), [urlQuery]);
  const userId = useGetUserId();

  /*
   * API - Fetch all Report Answers
   */
  const { httpAuthHeader } = useAccessToken();
  const { data: { data: allAnswers } = {}, isLoading } = useGetV3GfwTemplatesAllAnswers({ headers: httpAuthHeader });

  const rows = useMemo<TReportsDataTable[]>(
    () =>
      allAnswers?.map(answer => ({
        id: answer.id ?? "",
        createdAt: answer.attributes?.createdAt ?? "",
        monitor: answer.attributes?.fullName ?? "",
        alerts: getReportAlertsByName(answer.attributes?.reportName),
        name: answer.attributes?.reportName ?? "",
        area: answer.attributes?.areaOfInterestName ?? "",
        // @ts-ignore - types not correct
        template: answer.attributes?.templateName ?? "",
        templateId: answer.attributes?.report ?? "",
        coordinates: `${
          answer.attributes?.clickedPosition
            ?.map((position: any) => [position.lat, position.lon])[0]
            ?.toString()
            ?.replace(",", ", ") || ""
        }${(answer.attributes?.clickedPosition?.length || 0) > 1 ? "…" : ""}`,
        userId: answer.attributes?.user
      })) ?? [],
    [allAnswers]
  );

  const [filteredRows, setFilteredRows] = useState<TReportsDataTable[]>(rows);
  const intl = useIntl();

  const onFilterChange = (resp: any[]) => {
    setFilteredRows(resp);
  };

  const { filters, extraFilters } = useReportFilters(allAnswers, defaultTemplateFilter);

  const handleExport = useCallback(
    async (values: UnpackNestedValue<TExportForm>) => {
      // Do request
      let data;
      try {
        if (selectedReports.length === rows.length || selectedReports.length === 0) {
          data = (await exportService.exportAllReports(values.fileType, values.fields, values.email))?.data;
        } else {
          data = (await exportService.exportSomeReports(values.fileType, values.fields, selectedReports, values.email))
            ?.data;
        }

        fireGAEvent({
          category: "Monitoring",
          action: MonitoringActions.ExportedReport
        });

        return data;
      } catch (err) {
        // Do toast
        toastr.error(intl.formatMessage({ id: "export.error" }), "");
      }
    },
    [intl, rows.length, selectedReports]
  );

  return (
    <>
      <div className="l-content">
        <Loader isLoading={isLoading} />
        <Article
          title="reports.reports.subTitle"
          size="small"
          actions={
            <Link className="c-button c-button--primary" to={`${url}/export`}>
              <FormattedMessage id={selectedReports.length > 0 ? "export.selected" : "export.all"} />
            </Link>
          }
        >
          {!isLoading &&
            (allAnswers?.length === 0 ? (
              <EmptyState
                iconUrl={EmptyStateIcon}
                title={intl.formatMessage({ id: "reports.empty.state.title" })}
                text={intl.formatMessage({ id: "reports.empty.state.subTitle" })}
              />
            ) : (
              <>
                <DataFilter<TFilterFields, any>
                  filters={filters}
                  extraFilters={extraFilters}
                  onFiltered={onFilterChange}
                  options={rows}
                  className="c-data-filter--above-table"
                  defaults={{ template: defaultTemplateFilter || undefined }}
                />
                <DataTable<TReportsDataTable>
                  className="u-w-100"
                  rows={filteredRows}
                  isPaginated
                  onSelect={setSelectedReports}
                  selectFindGetter="id"
                  rowActions={[
                    {
                      name: "common.delete",
                      href: row => `${url}/${row.template}/${row.id}/delete/`,
                      shouldShow: row => row.userId === userId
                    },
                    {
                      name: "View",
                      href: row => `${url}/${row.templateId}/answers/${row.id}`
                    }
                  ]}
                  columnOrder={[
                    {
                      key: "createdAt",
                      name: "reports.reports.table.header.createDate",
                      rowLabel: (row, value) => {
                        return !Array.isArray(value)
                          ? intl.formatDate(value, { day: "2-digit", month: "2-digit", year: "2-digit" })
                          : "";
                      },
                      sortCompareFn: sortByDateString
                    },
                    { key: "name", name: "reports.reports.table.header.name", sortCompareFn: sortByString },
                    { key: "monitor", name: "reports.reports.table.header.monitor", sortCompareFn: sortByString },
                    {
                      key: "alerts",
                      name: "reports.reports.table.header.alertType",
                      rowLabel: (row, value) => {
                        if (!Array.isArray(value)) {
                          return "";
                        }
                        if (value.length === 0) {
                          return intl.formatMessage({ id: "layers.none" });
                        }

                        return value.map(alert => intl.formatMessage({ id: `layers.${alert.id}` })).join(", ");
                      },
                      sortCompareFn: (a, b, direction) => {
                        const newA = intl.formatMessage({ id: `layers.${a}`, defaultMessage: a?.toString() });
                        const newB = intl.formatMessage({ id: `layers.${b}`, defaultMessage: b?.toString() });

                        return sortByString(newA, newB, direction);
                      }
                    },
                    { key: "area", name: "reports.reports.table.header.area", sortCompareFn: sortByString },
                    {
                      key: "coordinates",
                      name: "reports.reports.table.header.coordinates",
                      sortCompareFn: sortByString
                    }
                  ]}
                />
              </>
            ))}
        </Article>
      </div>
      <Switch>
        <Route path={`${path}/:reportId/:id/delete`}>
          <DeleteRoute />
        </Route>
        <Route path={`${path}/export`}>
          <ExportModal
            onSave={handleExport}
            onClose={() => history.goBack()}
            isOpen
            fileTypes={REPORT_EXPORT_FILE_TYPES}
            defaultSelectedFields={[
              "fullName",
              "areaOfInterestName",
              "createdAt",
              "language",
              "userPosition",
              "reportName",
              "report",
              "templateName",
              "teamId",
              "areaOfInterest",
              "clickedPosition"
            ]}
            fields={[
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.fullName" }),
                value: "fullName"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.areaOfInterestName" }),
                value: "areaOfInterestName"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.createdAt" }),
                value: "createdAt"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.language" }),
                value: "language"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.userPosition" }),
                value: "userPosition"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.reportName" }),
                value: "reportName"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.report" }),
                value: "report"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.templateName" }),
                value: "templateName"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.teamId" }),
                value: "teamId"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.areaOfInterest" }),
                value: "areaOfInterest"
              },
              {
                label: intl.formatMessage({ id: "reports.reports.table.header.clickedPosition" }),
                value: "clickedPosition"
              }
            ]}
          />
        </Route>
      </Switch>
    </>
  );
};

export default Reports;
