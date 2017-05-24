import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';

function Hero({ title, action }) {
  return (
    <aside className="c-hero">
      <div className="row">
        <div className="column small-12">
          <div className="hero-content">
            <h1 className="text -large-title -white">{title}</h1>
            {action && <Button onClick={action.callback}>{action.name}</Button>}
          </div>
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
