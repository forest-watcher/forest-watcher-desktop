import { connect } from 'react-redux';
import ReportCard from './ReportCard';

const mapStateToProps = ({ reports }, { id }) => {
  const report = reports.report[id] && reports.report[id].attributes;
  return { report: { ...report, id } };
};

export default connect(mapStateToProps, null)(ReportCard);
