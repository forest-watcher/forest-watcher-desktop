import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function GridGallery(props) {
  const { Component, collection, columns } = props;
  return (
    <div className="row">
      {collection.map(item => (
        <div
          className={classnames(['column', {
            [`small-${columns.small}`]: columns.small,
            [`small-${columns.medium}`]: columns.medium,
            [`small-${columns.large}`]: columns.large
          }])}
          key={item}
        >
          <Component id={item} />
        </div>
      ))}
    </div>
  );
}

GridGallery.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component)
  ]).isRequired,
  collection: PropTypes.array,
  columns: PropTypes.shape({
    small: PropTypes.number,
    medium: PropTypes.number,
    large:PropTypes.number
  })
};

export default GridGallery;