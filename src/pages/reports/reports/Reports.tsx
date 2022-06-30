import Article from "components/layouts/Article";
import Hero from "components/layouts/Hero/Hero";
import Button from "components/ui/Button/Button";
import DataTable, { IRowAction } from "components/ui/DataTable/DataTable";
import AcceptOrDecline from "pages/teams/invitation/actions/AcceptOrDecline";
import { TPropsFromRedux } from "pages/teams/invitation/InvitationContainer";
import { FC, useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, RouteComponentProps, useRouteMatch } from "react-router-dom";

type TParams = {};

type TReportsDataTable = {
  id: string;
  createdAt: string;
  userRole: string;
};

interface IProps extends TPropsFromRedux, RouteComponentProps {}

const Reports: FC<IProps> = props => {
  const {} = props;
  const intl = useIntl();

  const rows = useMemo(() => [], []);

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
            <DataTable<TReportsDataTable>
              className="u-w-100"
              rows={rows}
              columnOrder={[
                { key: "createdAt", name: "reports.reports.table.header.createdAt" },
                { key: "createdAt", name: "reports.reports.table.header.monitor" },
                { key: "createdAt", name: "reports.reports.table.header.alertType" },
                { key: "createdAt", name: "reports.reports.table.header.name" },
                { key: "createdAt", name: "reports.reports.table.header.area" },
                { key: "createdAt", name: "reports.reports.table.header.coordinates" }
              ]}
              paginationLength={10}
            />
          </div>
        </Article>
      </div>
    </>
  );
};

export default Reports;
