import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function Tab({ options, selectedIndex, handleTabIndexChange, pill, style }) {
  let tabClass = pill ? "c-pill-tab" : "c-tab -right";
  if (style !== undefined) tabClass = `${tabClass} ${style}`;
  return (
    <div className={ tabClass }>
      <div className="nav-tab">
        {options.map((option, i) => (
          <button
            key={i}
            className={selectedIndex === i ? "-active" : ""}
            onClick={() => handleTabIndexChange(i)}
          >
            <FormattedMessage id={option}/>
          </button>
        ))}
      </div>
    </div>
  );
}

Tab.propTypes = {
  options: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  handleTabIndexChange: PropTypes.func.isRequired,
  pill: PropTypes.bool,
  style: PropTypes.string
};

export default Tab;
