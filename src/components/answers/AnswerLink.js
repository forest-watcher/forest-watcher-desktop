import React from 'react';
import { Link } from 'react-router';

function AnswerLink(props) {
  if (!props.data) return null;

  let dateString = 'No date';
  let userString = 'No user';
  const date = props.data.attributes.responses.filter((response) => response.question === 'date');
  const user = props.data.attributes.responses.filter((response) => response.question === 'name');
  if (date) {
    dateString = new Date(date[0].value).toDateString();
  }
  if (user) {
    userString = user[0].value;
  }
  return (
    <div>
      <p><strong>Date: </strong>{dateString}</p>
      <Link to={`/dashboard/questionaires/${props.data.attributes.questionnaire}/${props.data.id}/`}>Go to detail</Link>
    </div>
  );
}

export default AnswerLink;
