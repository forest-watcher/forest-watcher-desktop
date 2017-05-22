import React from 'react';
import { Link } from 'react-router-dom';

import Menu from '../../semantic/menu/Menu.js';

function AnswerLink(props) {
  if (!props.data) return null;

  let dateString = 'No date';
  let userString = 'No user';
  const date = props.data.attributes.responses.filter((response) => response.question === 'date');
  const user = props.data.attributes.responses.filter((response) => response.question === 'name');
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
      <Link to={`/reports/${props.data.attributes.questionnaire}/${props.data.id}/`}>Go to detail</Link>
    </div>
  );
}

class Answers extends React.Component {

  componentWillMount() {
    this.props.getReportAnswers(this.props.reportId);
  }

  onDownloadClick = () => {
    this.props.downloadAnswers(this.props.reportId);
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
        <Menu />
        <div className="c-dashboard">
          <div className="content-section answers">
            <h4>Answers for the report template</h4>
            <button onClick={this.onDownloadClick}> Download answers </button>
            <ul>
              {answers}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Answers;
