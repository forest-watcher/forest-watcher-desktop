import Article from "components/layouts/Article";
import Button from "components/ui/Button/Button";
import DataFilter from "components/ui/DataFilter/DataFilter";
import DataTable from "components/ui/DataTable/DataTable";
import { TPropsFromRedux } from "./ReportsContainer";
import { FC, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import useReportFilters from "./useReportFilters";
import Loader from "components/ui/Loader";
import EmptyState from "components/ui/EmptyState/EmptyState";
import EmptyStateIcon from "assets/images/icons/EmptyReports.svg";
import { sortByDateString, sortByString } from "helpers/table";
import DeleteRoute from "./actions/DeleteReportContainer";
import { getReportAlertsByName } from "helpers/reports";
import { IAlertIdentifier } from "constants/alerts";

export type TReportsDataTable = {
  id: string;
  createdAt: string;
  monitor: string;
  alerts: IAlertIdentifier[];
  name: string;
  area: string;
  coordinates: string;
  template: string;
};

export type TFilterFields = {
  area: string;
  template: string;
  timeFrame: string;
  submittedBy: string;
  alertType: string;
  voice: boolean;
};

interface IProps extends TPropsFromRedux {}

const Reports: FC<IProps> = props => {
  const { allAnswers, loading, templates } = props;
  let { path, url } = useRouteMatch();

  const rows = useMemo<TReportsDataTable[]>(
    () =>
      allAnswers?.map(answer => ({
        id: answer.id ?? "",
        createdAt: answer.attributes?.createdAt ?? "",
        monitor: answer.attributes?.fullName ?? "",
        alerts: getReportAlertsByName(answer.attributes?.reportName),
        name: answer.attributes?.reportName ?? "",
        area: answer.attributes?.areaOfInterestName ?? "",
        template: answer.attributes?.report ?? "",
        coordinates: answer.attributes?.userPosition?.toString().replace(",", ", ") ?? ""
      })) ?? [],
    [allAnswers]
  );
  const [filteredRows, setFilteredRows] = useState<TReportsDataTable[]>(rows);
  const intl = useIntl();

  const onFilterChange = (resp: any[]) => {
    setFilteredRows(resp);
  };

  const { filters, extraFilters } = useReportFilters(allAnswers, templates);

  return (
    <>
      <div className="l-content">
        <Loader isLoading={loading} />
        <Article
          title="reports.reports.subTitle"
          size="small"
          actions={
            <Button>
              <FormattedMessage id="export.title" />
            </Button>
          }
        >
          {!loading &&
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
                />
                <div className="u-responsive-table">
                  <DataTable<TReportsDataTable>
                    className="u-w-100"
                    rows={filteredRows}
                    isPaginated
                    onSelect={console.log}
                    selectFindGetter="id"
                    rowActions={[
                      {
                        name: "common.delete",
                        href: row => `${url}/${row.template}/${row.id}/delete/`
                      }
                    ]}
                    columnOrder={[
                      {
                        key: "createdAt",
                        name: "reports.reports.table.header.createdAt",
                        rowLabel: (row, value) => {
                          return !Array.isArray(value)
                            ? intl.formatDate(value, { day: "2-digit", month: "2-digit", year: "2-digit" })
                            : "";
                        },
                        sortCompareFn: sortByDateString
                      },
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
                      { key: "name", name: "reports.reports.table.header.name", sortCompareFn: sortByString },
                      { key: "area", name: "reports.reports.table.header.area", sortCompareFn: sortByString },
                      {
                        key: "coordinates",
                        name: "reports.reports.table.header.coordinates",
                        sortCompareFn: sortByString
                      }
                    ]}
                  />
                </div>
              </>
            ))}
        </Article>
      </div>
      <Switch>
        <Route path={`${path}/:reportId/:id/delete`}>
          <DeleteRoute />
        </Route>
      </Switch>
    </>
  );
};

export default Reports;
