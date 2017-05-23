import { connect } from 'react-redux';
import { getReportAnswers } from '../../../modules/data';

import AnswersDetail from './AnswersDetail';

const mapStateToProps = ({ data }, ownProps) => {
  const { params } = ownProps.match || {};
  let answer = false;
  if (data.answers[params.reportId]) {
    answer = data.answers[params.reportId].filter(ans => ans.id === params.answerId)[0];
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
