import React from 'react';
import PropTypes from 'prop-types';

import Menu from '../../layouts/menu/Menu';

class AnswersDetail extends React.Component {

  componentWillMount() {
    if (!this.props.answer) {
      this.props.getReportAnswers(this.props.reportId);
    }
  }

  getResponse = ({ data }) => {
    if (!data) return null;
    return (
      <div>
        <span className="label"><strong>{data.question}: </strong> </span>
        {data.question === 'deforestation-image'
          ? <img src={data.value} alt="deforestation" />
          : <span className="value">{data.value}</span>
        }
      </div>
    );
  }

  render() {
    const { data } = this.props;
    if (!data) return null; // TODO: loading state
    const responses = data.attributes && data.attributes.responses;
    return (
      <div>
        <Menu />
        <div className="c-dashboard">
          <div className="content-section answers">
            <h4>Responses for the template {data.attributes.questionnaire} in {data.id}</h4>
            <ul>
              {responses.map(response => (<li key={response.id}>{this.getResponse(response)}</li>))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

AnswersDetail.propTypes = {
  data: PropTypes.object,
  getReportAnswers: PropTypes.func.isRequired,
  answer: PropTypes.object,
  reportId: PropTypes.string
};

export default AnswersDetail;
