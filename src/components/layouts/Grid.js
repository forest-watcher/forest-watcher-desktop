import React from 'react';
import PropTypes from 'prop-types';

function Grid(props) {
  const { Item, collection, columns } = props;
  return (
    <div className="row">
      {collection.map(item => (<div className={`column medium-${columns}`} key={item.id} ><Item data={item} /></div>))}
    </div>
  );
}

Grid.propTypes = {
  Item: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component)
  ]).isRequired,
  collection: PropTypes.array,
  columns: PropTypes.number
};

export default Grid;