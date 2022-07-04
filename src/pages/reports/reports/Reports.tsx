import Article from "components/layouts/Article";
import Button from "components/ui/Button/Button";
import DataFilter from "components/ui/DataFilter/DataFilter";
import DataTable from "components/ui/DataTable/DataTable";
import { TPropsFromRedux } from "pages/teams/invitation/InvitationContainer";
import { FC, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import useReportFilters from "./useReportFilters";

export type TReportsDataTable = {
  id: string;
  createdAt: string;
  monitor: string;
  alertType: string;
  name: string;
  area: string;
  coordinates: string;
};

export type TFilterFields = {
  area: string;
  template: string;
  timeFrame: string;
  submittedBy: string;
  alertType: string;
  voice: boolean;
};

interface IProps extends TPropsFromRedux, RouteComponentProps {}

const Reports: FC<IProps> = props => {
  const rows = useMemo<any[]>(() => [], []); // Set any[] to report type
  const [filteredRows, setFilteredRows] = useState(rows);

  const onFilterChange = (resp: any[]) => {
    setFilteredRows(resp);
  };

  const { filters, extraFilters } = useReportFilters();

  return (
    <>
      <div className="l-content">
        <Article
          title="reports.reports.subTitle"
          size="small"
          actions={
            <>
              <Button>
                <FormattedMessage id="import.title" />
              </Button>
              <Button>
                <FormattedMessage id="export.title" />
              </Button>
            </>
          }
        >
          <div className="u-responsive-table">
            <DataFilter<TFilterFields, any>
              filters={filters}
              extraFilters={extraFilters}
              onFiltered={onFilterChange}
              options={rows}
              className="c-data-filter--above-table"
            />
            <DataTable<TReportsDataTable>
              className="u-w-100"
              rows={filteredRows}
              isPaginated
              columnOrder={[
                { key: "createdAt", name: "reports.reports.table.header.createdAt" },
                { key: "monitor", name: "reports.reports.table.header.monitor" },
                { key: "alertType", name: "reports.reports.table.header.alertType" },
                { key: "name", name: "reports.reports.table.header.name" },
                { key: "area", name: "reports.reports.table.header.area" },
                { key: "coordinates", name: "reports.reports.table.header.coordinates" }
              ]}
            />
          </div>
        </Article>
      </div>
    </>
  );
};

export default Reports;
