import { connect } from 'react-redux';
import { getReportAnswers, downloadAnswers } from '../../../modules/reports';

import Answers from './Answers';

const mapStateToProps = ({ reports }, ownProps) => {
  const { params } = ownProps.match || {};
  return ({
    answers: reports.answers[params.reportId],
    reportId: params.reportId
  });
};

function mapDispatchToProps(dispatch) {
  return {
    getReportAnswers: (reportId) => {
      dispatch(getReportAnswers(reportId));
    },
    downloadAnswers: (reportId) => {
      dispatch(downloadAnswers(reportId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Answers);
