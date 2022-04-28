import { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

class Answers extends Component {
  componentWillMount() {
    this.props.getReportAnswers(this.props.reportId);
  }

  onDownloadClick = () => {
    this.props.downloadAnswers(this.props.reportId);
  };

  getAnswerLink = ({ attributes, id }) => {
    let dateString = <FormattedMessage id="reports.dateString" />;
    let userString = <FormattedMessage id="reports.userString" />;
    const date = attributes.responses.filter(response => response.question === "date");
    const user = attributes.responses.filter(response => response.question === "name");
    if (date && date[0]) {
      dateString = new Date(date[0].value).toDateString();
    }
    if (user && user[0]) {
      userString = user[0].value;
    }
    return (
      <div>
        <p>
          <strong>
            <FormattedMessage id="reports.date" />:{" "}
          </strong>
          {dateString}
        </p>
        <p>
          <strong>
            <FormattedMessage id="reports.user" />:{" "}
          </strong>
          {userString}
        </p>
        <Link to={`/reports/${id}`}>
          <FormattedMessage id="reports.detailLink" />
        </Link>
      </div>
    );
  };

  render() {
    const { answers = [] } = this.props;
    return (
      <div className="row columns">
        <div className="c-dashboard">
          <div className="content-section answers">
            <h4>
              <FormattedMessage id="reports.answersTitle" />
            </h4>
            <button onClick={this.onDownloadClick}>
              <FormattedMessage id="reports.downloadAnswers" />
            </button>
            <ul>
              {answers.map(answer => (
                <li key={answer.id}>{this.getAnswerLink(answer)}</li>
              ))}
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
