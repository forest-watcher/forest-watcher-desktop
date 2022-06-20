import { FC } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { TPropsFromRedux } from "./ReportsContainer";
import Hero from "components/layouts/Hero/Hero";
import { IProps as ITabGroupProps } from "../../components/ui/TabGroup/TabGroup";

type TParams = {
  reportingTab: string;
};

interface IProps extends TPropsFromRedux, RouteComponentProps<TParams> {}

const pageTabs: ITabGroupProps["options"] = [
  {
    value: "investigation",
    name: "reporting.tabs.investigation",
    href: "/reporting/investigation"
  },
  {
    value: "reports",
    name: "reporting.tabs.reports",
    href: "/reporting/reports"
  }
];

const Reports: FC<IProps> = props => {
  const { match } = props;
  const { reportingTab } = match.params;

  return !pageTabs.find(pageTab => pageTab.value === reportingTab) ? (
    <Redirect to={`/reporting/investigation`} />
  ) : (
    <div className="l-reporting">
      <Hero title="reports.name" pageTabs={{ value: reportingTab, options: pageTabs }} />
    </div>
  );
};

export default Reports;
