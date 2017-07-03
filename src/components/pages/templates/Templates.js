import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import GridGallery from '../../layouts/GridGallery';

import ReportCard from '../../report-card/ReportCardContainer';

class Templates extends React.Component {

  componentWillMount() {
    const { getUserTemplates, templateIds } = this.props;
    if(!templateIds.length) getUserTemplates();
  }

  render() {
    const { templateIds } = this.props;
    return (
      <div>
        <Hero
          title="templates.title"
        />
      <div className="l-content">
          <Article title="templates.subtitle">
            <GridGallery
              Component={ReportCard}
              className="report-card-item"
              collection={templateIds}
              columns={{ small: 12, medium: 4, large: 3 }}
            />
          </Article>
        </div>
      </div>
    );
  }
}

Templates.propTypes = {
  getUserTemplates: PropTypes.func.isRequired,
  templateIds: PropTypes.array.isRequired
};

export default Templates;
