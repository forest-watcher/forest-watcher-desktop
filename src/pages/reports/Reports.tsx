import { FC, useEffect, useState } from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { TPropsFromRedux } from "./ReportsContainer";
import Hero from "components/layouts/Hero/Hero";
import { IProps as ITabGroupProps } from "components/ui/TabGroup/TabGroup";
import InvestigationPage from "./investigation/InvestigationContainer";
import ReportsPage from "./reports/ReportsContainer";
import classnames from "classnames";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import OnboardingModal from "components/onboarding/OnboardingModal";

type TParams = {
  reportingTab: string;
};

interface IProps extends TPropsFromRedux, RouteComponentProps<TParams> {}

const INVESTIGATION_PATH = "/reporting/investigation";
const REPORTS_PATH = "/reporting/reports";

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
  const { match, getAllReports } = props;
  const { reportingTab } = match.params;
  const [onboarding] = useState<boolean>(true);

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  return !pageTabs.find(pageTab => pageTab.value === reportingTab) ? (
    <Redirect to={INVESTIGATION_PATH} />
  ) : (
    <div className={classnames(match.url.includes(INVESTIGATION_PATH) && "l-full-page-map")}>
      <Hero title="reports.name" pageTabs={{ value: reportingTab, options: pageTabs }} />

      <OptionalWrapper data={onboarding}>
        <OnboardingModal
          isOpen
          onClose={() => console.log("asdsad")}
          steps={[{ heading: "New in this version", title: "Add Areas", text: "asdasdasd", imageUrl: "asd" }]}
        />
      </OptionalWrapper>

      <Switch>
        <Route path={INVESTIGATION_PATH} component={InvestigationPage} />
        <Route path={REPORTS_PATH} component={ReportsPage} />
      </Switch>
    </div>
  );
};

export default Reports;
