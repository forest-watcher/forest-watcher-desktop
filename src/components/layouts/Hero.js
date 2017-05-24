import React from 'react';
import PropTypes from 'prop-types';

function Hero({ title, action }) {
  return (
    <aside className="c-hero">
      <div className="hero-content row align-middle">
        <div className="hero-section column medium-5">
          <h1>{title}</h1>
        </div>
        <div className="hero-section column medium-7">
          {action && <button onClick={action.callback}>{action.name}</button>}
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
