import React from 'react';
import AnswerLink from '../../answers/AnswerLink.js';
import DashboardMenu from '../../DashboardMenu.js';

class AnswersPage extends React.Component {

  componentWillMount() {
    this.props.getReportAnswers(this.props.reportId);
  }

  render() {
    let answers = [];
    const { data } = this.props;
    if (data && data.length) {
      for (let i = 0, dLength = data.length || 0; i < dLength; i++) {
        answers.push(<li key={i}><AnswerLink data={data[i]} /></li>);
      }
    }

    return (
      <div>
        <DashboardMenu />
        <div className="c-dashboard">
          <div className="content-section answers">
            <h4>Answers for the questionnaire</h4>
            <ul>
              {answers}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default AnswersPage;
