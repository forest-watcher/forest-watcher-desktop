import React from 'react';
import PropTypes from 'prop-types';

function Hero({ title, action }) {
  return (
    <aside className="c-hero">
      <div className="row column">
        <div className="hero-content">
          <h1 className="text -large-title -white">{title}</h1>
          {action && <button className="c-button -hero" onClick={action.callback}>{action.name}</button>}
        </div>
      </div>
    </aside>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  action: PropTypes.shape({
    name: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
  })
};

export default Hero;
