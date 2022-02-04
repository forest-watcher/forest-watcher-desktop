/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

function Checkbox({ id, callback, label, defaultChecked, checked, labelId, classNames, disabled }) {
  return (
    <div className={classnames(["c-checkbox", classNames])}>
      <div className="checkbox">
        {typeof checked !== "undefined" ? (
          <input
            type="checkbox"
            className="test-checkbox test-checkbox-disabled"
            id={id}
            onChange={callback}
            defaultChecked={defaultChecked}
            checked={checked}
            disabled={disabled}
          />
        ) : (
          <input
            type="checkbox"
            className="test-checkbox test-checkbox-enabled"
            id={id}
            onChange={callback}
            defaultChecked={defaultChecked}
            disabled={disabled}
          />
        )}
        <label htmlFor={id}></label>
      </div>
      <div className="label test-checkbox-label">{label || labelId}</div>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.object,
  labelId: PropTypes.string
};

export default Checkbox;
