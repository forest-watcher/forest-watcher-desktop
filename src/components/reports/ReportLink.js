import React from 'react';
import { Link } from 'react-router';

function ReportLink(props) {
  return (
    <Link to={`/dashboard/questionaires/${props.data.id}`}>{props.data.attributes.name}</Link>
  );
}

export default ReportLink;