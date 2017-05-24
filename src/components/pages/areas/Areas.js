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
    const { areas } = this.props.data || {};
    return (
      <div>
        <Hero
          title="Areas of Interest"
          action={{
            name: 'Download All',
            callback: () => console.info('download all')
          }}
        />
        <div className="c-areas">
          <Article title="Your Areas">
            <GridGallery collection={areas} columns={4} Component={AreaTile} />
          </Article>
        </div>
      </div>
    );
  }
}

Areas.propTypes = {
  data: PropTypes.object.isRequired,
  getUserAreas: PropTypes.func.isRequired
};

export default Areas;
