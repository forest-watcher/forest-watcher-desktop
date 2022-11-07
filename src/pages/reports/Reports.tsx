import { FC, useEffect } from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { TPropsFromRedux } from "./ReportsContainer";
import Hero from "components/layouts/Hero/Hero";
import { IProps as ITabGroupProps } from "components/ui/TabGroup/TabGroup";
import InvestigationPage from "./investigation/InvestigationContainer";
import ReportsPage from "./reports/ReportsContainer";
import classnames from "classnames";
import Assignments from "./assignments/Assignments";

type TParams = {
  reportingTab: string;
};

interface IProps extends TPropsFromRedux, RouteComponentProps<TParams> {}

const INVESTIGATION_PATH = "/reporting/investigation";
const REPORTS_PATH = "/reporting/reports";
const ASSIGNMENTS_PATH = "/reporting/assignments";

const pageTabs: ITabGroupProps["options"] = [
  {
    value: "investigation",
    name: "reporting.tabs.investigation",
    href: INVESTIGATION_PATH
  },
  {
    value: "reports",
    name: "reporting.tabs.reports",
    href: REPORTS_PATH
  },
  {
    value: "assignments",
    name: "reporting.tabs.assignments",
    href: ASSIGNMENTS_PATH
  }
];

const Reports: FC<IProps> = props => {
  const { match, getAllReports } = props;
  const { reportingTab } = match.params;

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  return !pageTabs.find(pageTab => pageTab.value === reportingTab) ? (
    <Redirect to={INVESTIGATION_PATH} />
  ) : (
    <div className={classnames(match.url.includes(INVESTIGATION_PATH) && "l-full-page-map")}>
      <Hero title="reports.name" pageTabs={{ value: reportingTab, options: pageTabs }} />
      <Switch>
        <Route path={INVESTIGATION_PATH} component={InvestigationPage} />
        <Route path={REPORTS_PATH} component={ReportsPage} />
        <Route path={ASSIGNMENTS_PATH} component={Assignments} />
      </Switch>
    </div>
  );
};

export default Reports;
