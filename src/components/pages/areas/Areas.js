import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import { Link } from 'react-router-dom';
import GridGallery from '../../layouts/GridGallery';
import AreaCard from '../../area-card/AreaCardContainer';
import Icon from '../../ui/Icon';
import querystring from 'query-string';
import { FormattedMessage } from 'react-intl';

class Areas extends React.Component {

  componentWillMount() {
    this.trimQueryParams();
  }

  trimQueryParams() {
    const { location, history } = this.props;
    const search = location.search || '';
    const queryParams = querystring.parse(search);
    if (queryParams.token) {
      const newSearch = querystring.stringify({ ...queryParams, token: undefined });
      history.replace('/areas', { search: newSearch });
    }
  }

  getAddArea = () => {
    if (this.props.loading) return null;
    return (
      <Link to="/areas/create">
        <button className="c-add-card">
          <Icon name="icon-plus" className="-medium -green" />
            <span className="text -x-small-title -green"><FormattedMessage id="areas.addArea" /></span>
        </button>
      </Link>
    );
  }

  render() {
    const { areasList } = this.props;
    return (
      <div>
        <Hero
          title="areas.title"
        />
        <div className="l-content">
          <Article title="areas.subtitle">
            <GridGallery
              collection={areasList}
              className="area-card-item"
              columns={{ small: 12, medium: 4, large: 3 }}
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
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  areasList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Areas;
