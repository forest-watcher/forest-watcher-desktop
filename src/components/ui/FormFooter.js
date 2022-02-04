import React from "react";
import PropTypes from "prop-types";

function FormFooter({ children }) {
  return (
    <div className="c-form-footer">
      <div className="row column">
        <div className="container">{children}</div>
      </div>
    </div>
  );
}

FormFooter.propTypes = {
  children: PropTypes.node
};

export default FormFooter;
