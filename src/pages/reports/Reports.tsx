import { FC } from "react";
import { TPropsFromRedux } from "./ReportsContainer";
import Hero from "components/layouts/Hero/Hero";

interface IProps extends TPropsFromRedux {}

const Reports: FC<IProps> = () => {
  return (
    <div>
      <Hero title="reports.name"></Hero>
    </div>
  );
};

export default Reports;
