import React from 'react';
import PropTypes from 'prop-types';

function Icon({ name, className }) {
  return (
    <svg className={`c-icon ${className || ''}`}>
      <use xlinkHref={`#${name}`} />
    </svg>
  );
}

Icon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string
};

export default Icon;