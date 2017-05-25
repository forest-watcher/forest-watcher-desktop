import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import GridGallery from '../../layouts/GridGallery';

import ReportCard from '../../report-card/ReportCardContainer';

class Reports extends React.Component {

  componentWillMount() {
    this.props.getUserReports();
  }

  render() {
    const { reportsList } = this.props;
    return (
      <div>
        <Hero
          title="Reports"
        />
        <div className="c-reports">
          <Article title="Uploaded">
            <GridGallery
              Component={ReportCard}
              collection={reportsList}
              columns={{ small: 12, medium: 3 }}
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
