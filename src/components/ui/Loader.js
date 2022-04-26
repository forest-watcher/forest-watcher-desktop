import React from "react";

// TODO: Dont show loader if the loading time < 1s (or make background transparent)
function Loader(props) {
  return (
    <div>
      {props.isLoading && (
        <div className="c-loader">
          <div className="c-loading-spinner test-loader-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Loader;
