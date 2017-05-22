import React from 'react';
import Menu from '../../semantic/menu/Menu';

function Response(props) {
  if (!props.data) return null;
  return (
    <div>
      <span className="label"><strong>{props.data.question}: </strong> </span>
      {props.data.question === 'deforestation-image'
        ? <img src={props.data.value} alt="deforestation" />
        : <span className="value">{props.data.value}</span>
      }
    </div>
  );
}

class AnswersDetail extends React.Component {

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
        <Menu />
        <div className="c-dashboard">
          <div className="content-section answers">
            <h4>Responses for the template {data.attributes.questionnaire} in {data.id}</h4>
            <ul>
              {responses}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default AnswersDetail;
