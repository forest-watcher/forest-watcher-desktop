import { connect } from 'react-redux';
import ReportCard from './ReportCard';

const mapStateToProps = ({ reports }, { id }) => {
  const area = reports.report[id] && reports.report[id].attributes;
  return { area: { ...report, id } };
};

export default connect(mapStateToProps, null)(ReportCard);
