import React from 'react';
import PropTypes from 'prop-types';

function GridGallery(props) {
  const { Component, collection, columns } = props;
  return (
    <div className="row">
      {collection.map(item => (<div className={`column medium-${columns}`} key={item.id} ><Component data={item} /></div>))}
    </div>
  );
}

GridGallery.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component)
  ]).isRequired,
  collection: PropTypes.array,
  columns: PropTypes.number
};

export default GridGallery;