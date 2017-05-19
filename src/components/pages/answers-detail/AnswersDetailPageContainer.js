import { connect } from 'react-redux';
import { getReportAnswers } from '../../../modules/data';

import AnswersPage from './AnswersDetailPage';

const mapStateToProps = ({ data }, { params }) => {
  const { reportId, answerId } = params;
  let answer = false;
  if (data.answers[reportId]) {
    answer = data.answers[reportId].filter((answer) => answer.id === answerId)[0];
  }
  return {
    data: answer,
    reportId
  }
};

function mapDispatchToProps(dispatch) {
  return {
    getReportAnswers: (reportId) => {
      dispatch(getReportAnswers(reportId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswersPage);
