import React from 'react';
import { Link } from 'react-router-dom';

function ReportLink(props) {
  return (
    <Link to={`/templates/${props.data.id}`}>{props.data.attributes.name}</Link>
  );
}

export default ReportLink;
