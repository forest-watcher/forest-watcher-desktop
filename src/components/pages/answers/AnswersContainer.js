import { connect } from 'react-redux';
import { getReportAnswers, downloadAnswers } from '../../../modules/data';

import Answers from './Answers';

const mapStateToProps = ({ data }, ownProps) => {
  const { params } = ownProps.match || {};
  return ({
    answers: data.answers[params.reportId],
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
