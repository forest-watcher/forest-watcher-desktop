import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import GridGallery from '../../layouts/GridGallery';

import ReportCard from '../../report-card/ReportCardContainer';

class Reports extends React.Component {

  componentWillMount() {
    const { getUserReports, reportsList } = this.props;
    if(!reportsList.length) getUserReports();
  }

  render() {
    const { reportsList } = this.props;
    return (
      <div>
        <Hero
          title="Reports"
        />
      <div className="l-content">
          <Article title="Uploaded">
            <GridGallery
              Component={ReportCard}
              className="report-card-item"
              collection={reportsList}
              columns={{ small: 12, medium: 4, large: 3 }}
            />
          </Article>
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  getUserReports: PropTypes.func.isRequired,
  reportsList: PropTypes.array.isRequired
};

export default Reports;
