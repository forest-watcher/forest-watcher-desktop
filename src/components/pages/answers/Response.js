import React from 'react';

function Response(props) {
  if (!props.data) return null;
  debugger;
  return (
    <div>
      <span className="label"><strong>{props.data.question}: </strong> </span>
      <span className="value">{props.data.value}</span>
    </div>
  );
}

export default Response;
