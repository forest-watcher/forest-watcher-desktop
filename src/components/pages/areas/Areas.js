import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import GridGallery from '../../layouts/GridGallery';
import AreaTile from '../../ui/AreaTile';

class Areas extends React.Component {

  componentWillMount() {
    this.props.getUserAreas();
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
            <GridGallery collection={areasList} columns={4} Component={AreaTile} />
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
