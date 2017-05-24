import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import GridGallery from '../../layouts/GridGallery';
import AreaTile from '../../area-tile/AreaTileContainer';

class Areas extends React.Component {

  componentWillMount() {
    if (!this.props.areasList.length) this.props.getUserAreas();
  }

  render() {
    const { areasList } = this.props;
    return (
      <div>
        <Hero
          title="Areas of Interest"
        />
        <div className="c-areas">
          <Article title="Your Areas">
            <GridGallery collection={areasList} columns={{ medium: 3 }} Component={AreaTile} />
          </Article>
        </div>
      </div>
    );
  }
}

Areas.propTypes = {
  areasList: PropTypes.array.isRequired,
  getUserAreas: PropTypes.func.isRequired
};

export default Areas;
