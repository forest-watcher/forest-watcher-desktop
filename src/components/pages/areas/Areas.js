import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import { Link } from 'react-router-dom';
import GridGallery from '../../layouts/GridGallery';
import AreaCard from '../../area-card/AreaCardContainer';
import Icon from '../../ui/Icon';

class Areas extends React.Component {

  componentWillMount() {
    if (!this.props.areasList.length) this.props.getUserAreas();
  }

  getAddArea = () => {
    if (this.props.loading) return null;
    return (
      <Link to="/areas/create">
        <button className="c-add-card">
          <Icon name="icon-plus" className="-medium -green" />
            Add Area
        </button>
      </Link>
    );
  }

  render() {
    const { areasList } = this.props;
    return (
      <div>
        <Hero
          title="Areas of Interest"
        />
        <div className="l-content">
          <Article title="Your Areas">
            <GridGallery
              collection={areasList}
              className="area-card-item"
              columns={{ small: 12, medium: 3 }}
              Component={AreaCard}
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
