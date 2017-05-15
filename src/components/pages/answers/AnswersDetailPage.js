import React from 'react';
import Response from './Response.js';
import DashboardMenu from '../../DashboardMenu.js';

class AnswersPage extends React.Component {

  componentWillMount() {
    if (!this.props.answer) {
      this.props.getReportAnswers(this.props.reportId);
    }
  }

  render() {
    const { data } = this.props;
    if (!data) return null; // TODO: loading state
    const responseData = data.attributes.responses;
    let responses = [];
    if (responseData && responseData.length > 0) {
      for (let i = 0, dLength = responseData.length || 0; i < dLength; i++) {
        responses.push(<li key={i}><Response data={responseData[i]} /></li>);
      }
    }

    return (
      <div>
        <DashboardMenu />
        <div className="c-dashboard">
          <div className="content-section answers">
            <h4>Responses for the questionnaire {data.attributes.questionnaire} in {data.id}</h4>
            <ul>
              {responses}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default AnswersPage;
