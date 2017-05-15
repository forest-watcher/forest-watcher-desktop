import React from 'react';

function Response(props) {
  if (!props.data) return null;
  return (
    <div>
      <span className="label"><strong>{props.data.question}: </strong> </span>
      {props.data.question === 'deforestation-image'
        ? <img src={props.data.value} />
        : <span className="value">{props.data.value}</span>
      }
    </div>
  );
}

export default Response;
