import React from 'react';

function Loader(props) {
  return (
    <div>
      {props.isLoading &&
        <div className="c-loader">
          <div className="c-loading-spinner"></div>
        </div>
      }
    </div>
  );
}

export default Loader;
