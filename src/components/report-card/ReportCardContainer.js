import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReportCard from "./ReportCard";

const mapStateToProps = ({ templates }, { id }) => {
  const template = templates.data[id] && templates.data[id].attributes;
  return { template: { ...template, id } };
};

export default withRouter(connect(mapStateToProps, null)(ReportCard));
