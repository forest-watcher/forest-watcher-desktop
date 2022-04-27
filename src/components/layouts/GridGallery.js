import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

function GridGallery(props) {
  const { Component, collection, columns, before, after, className } = props;
  const gridClasses = classnames([
    className,
    "column",
    {
      [`small-${columns.small}`]: columns.small,
      [`medium-${columns.medium}`]: columns.medium,
      [`large-${columns.large}`]: columns.large
    }
  ]);
  return (
    <div className="row">
      {before && <div className={gridClasses}>{before}</div>}
      {collection.map(item => (
        <div className={gridClasses} key={item}>
          <Component id={item} />
        </div>
      ))}
      {after && <div className={gridClasses}>{after}</div>}
    </div>
  );
}

GridGallery.defaultProps = {
  className: "grid-gallery-item"
};

GridGallery.propTypes = {
  before: PropTypes.element,
  after: PropTypes.element,
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(React.Component)]).isRequired,
  collection: PropTypes.array.isRequired,
  columns: PropTypes.shape({
    small: PropTypes.number,
    medium: PropTypes.number,
    large: PropTypes.number
  }).isRequired,
  className: PropTypes.string
};

export default GridGallery;
