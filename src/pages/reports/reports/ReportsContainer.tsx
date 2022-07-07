import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import Reports from "./Reports";
import { getAllReports } from "modules/reports";

const mapStateToProps = ({ reports, templates }: RootState) => ({
  allAnswers: reports.allAnswers,
  loading: reports.loading,
  templates: templates.templates
});

const mapDispatchToProps = { getAllReports };

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Reports);
