import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Menu from '../../layouts/menu/Menu';

class Answers extends React.Component {

  componentWillMount() {
    this.props.getReportAnswers(this.props.reportId);
  }

  onDownloadClick = () => {
    this.props.downloadAnswers(this.props.reportId);
  }

  getAnswerLink = ({ attributes, id }) => {
    let dateString = 'No date';
    let userString = 'No user';
    const date = attributes.responses.filter(response => response.question === 'date');
    const user = attributes.responses.filter(response => response.question === 'name');
    if (date && date[0]) {
      dateString = new Date(date[0].value).toDateString();
    }
    if (user && user[0]) {
      userString = user[0].value;
    }
    return (
      <div>
        <p><strong>Date: </strong>{dateString}</p>
        <p><strong>User: </strong>{userString}</p>
        <Link to={`/reports/${attributes.questionnaire}/${id}/`}>Go to detail</Link>
      </div>
    );
  }

  render() {
    const { answers = [] } = this.props;
    return (
      <div>
        <Menu />
        <div className="c-dashboard">
          <div className="content-section answers">
            <h4>Answers for the report template</h4>
            <button onClick={this.onDownloadClick}> Download answers </button>
            <ul>
              {answers.map(answer => (<li key={answer.id}>{this.getAnswerLink(answer)}</li>))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Answers.propTypes = {
  answers: PropTypes.array,
  getReportAnswers: PropTypes.func.isRequired,
  downloadAnswers: PropTypes.func.isRequired,
  reportId: PropTypes.string.isRequired
};

export default Answers;
