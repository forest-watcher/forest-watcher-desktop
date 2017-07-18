import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classnames from 'classnames';

function Checkbox({ id, callback, label, defaultChecked, checked , labelId, intl, classNames }) {
  return (
    <div className={classnames(['c-checkbox', classNames])}>
      <div className="checkbox">
        { typeof checked !== 'undefined' ? 
          <input type="checkbox" id={id} onChange={callback} defaultChecked={defaultChecked} checked={checked}/>
          :
          <input type="checkbox" id={id} onChange={callback} defaultChecked={defaultChecked}/>
        }
        <label htmlFor={id}></label>
      </div>
      <div className="label">{label || (labelId && intl.formatMessage({ id: labelId }))}</div>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.string,
  labelId: PropTypes.string
};

export default injectIntl(Checkbox);