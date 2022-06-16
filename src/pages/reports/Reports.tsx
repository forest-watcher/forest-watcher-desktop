import { FC } from "react";
import { TPropsFromRedux } from "./ReportsContainer";

interface IProps extends TPropsFromRedux {}

const Reports: FC<IProps> = () => {
  return <div>Reports</div>;
};

export default Reports;
