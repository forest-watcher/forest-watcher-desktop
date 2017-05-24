import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import GridGallery from '../../layouts/GridGallery';
import AreaTile from '../../area-tile/AreaTileContainer';
import Icon from '../../ui/Icon';

class Areas extends React.Component {

  componentWillMount() {
    if (!this.props.areasList.length) this.props.getUserAreas();
  }

  getAddArea = () => {
    if (this.props.loading) return null;
    return (
      <button className="c-add-card">
        <Icon name="icon-plus" className="-medium" />
          Add Area
      </button>
    );
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
            <GridGallery
              collection={areasList}
              className="area-tile-item"
              columns={{ small: 12, medium: 3 }}
              Component={AreaTile}
              after={this.getAddArea()}
            />
          </Article>
        </div>
      </div>
    );
  }
}

Areas.propTypes = {
  areasList: PropTypes.array.isRequired,
  getUserAreas: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Areas;
