import React from 'react';
import PropTypes from 'prop-types';

export default function Button(props) {
  const isString = props.children && typeof props.children === 'string';
  return (
    <button
      className={props.className}
      type="button"
      onClick={props.onClick}
    >
      {props.uppercase && isString && props.children.toUpperCase()}
      {!isString && props.children}
    </button>
  );
}

Button.defaultProps = {
  className: 'c-button',
  uppercase: true
};

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  uppercase: PropTypes.bool
};