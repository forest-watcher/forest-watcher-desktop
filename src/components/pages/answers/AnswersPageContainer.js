import { connect } from 'react-redux';
import { getReportAnswers, downloadAnswers } from '../../../modules/data';

import AnswersPage from './AnswersPage';

const mapStateToProps = ({ data }, { params }) => ({
  data: data.answers[params.reportId],
  reportId: params.reportId
});

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

export default connect(mapStateToProps, mapDispatchToProps)(AnswersPage);
