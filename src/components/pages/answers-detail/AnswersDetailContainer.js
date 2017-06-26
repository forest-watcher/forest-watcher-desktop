import { connect } from 'react-redux';
import { getReportAnswers } from '../../../modules/reports';

import AnswersDetail from './AnswersDetail';

const mapStateToProps = ({ reports }, ownProps) => {
  const { params } = ownProps.match || {};
  let answer = false;
  if (reports.answers[params.reportId]) {
    answer = reports.answers[params.reportId].filter(ans => ans.id === params.answerId)[0];
  }
  return {
    data: answer || null,
    reportId: params.reportId
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getReportAnswers: (reportId) => {
      dispatch(getReportAnswers(reportId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswersDetail);
