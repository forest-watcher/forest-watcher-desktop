import React from 'react';
import PropTypes from 'prop-types';

function Checkbox({ id, callback, label, defaultChecked, checked }) {
  return (
    <div className="c-checkbox">
      <div className="checkbox">
        { typeof checked !== 'undefined' ? 
          <input type="checkbox" id={id} onChange={callback} defaultChecked={defaultChecked} checked={checked}/>
          :
          <input type="checkbox" id={id} onChange={callback} defaultChecked={defaultChecked}/>
        }
        <label htmlFor={id}></label>
      </div>
      <div className="label">{label}</div>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.string
};

export default Checkbox;