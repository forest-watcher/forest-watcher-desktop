import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReportCard from './ReportCard';

const mapStateToProps = ({ reports }, { id }) => {
  const report = reports.report[id] && reports.report[id].attributes;
  return { report: { ...report, id } };
};

export default withRouter(connect(mapStateToProps, null)(ReportCard));
