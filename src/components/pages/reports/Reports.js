import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import GridGallery from '../../layouts/GridGallery';

class Reports extends React.Component {

  componentWillMount() {
    this.props.getUserReports();
  }

  render() {
    const { reports } = this.props.data || {};
    return (
      <div>
        <Hero
          title="Reports"
        />
        <div className="c-dashboard">
          <Article title="Uploaded">
            <GridGallery Component="" columns=""/>
            <ul>
              {
                reports.map(report => (
                  <li key={report.id}>
                    <Link to={`/reports/${report.id}`}>{report.attributes.name}</Link>
                  </li>
                ))
              }
            </ul>
          </Article>
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  getUserReports: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default Reports;
