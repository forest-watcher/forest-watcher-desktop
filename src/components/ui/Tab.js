import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function Tab({ options, selectedIndex, handleTabIndexChange }) {
  return (
    <div className="c-tab -right">
      <div className="nav-tab">
        {options.map((option, i) => (
          <a 
            key={i} 
            className={selectedIndex === i ? "-active" : ""} 
            onClick={() => handleTabIndexChange(i)}
          >
            <FormattedMessage id={option}/>
          </a>
        ))}
      </div>
    </div>
  );
}

Tab.propTypes = {
  options: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  handleTabIndexChange: PropTypes.func.isRequired
};

export default Tab;