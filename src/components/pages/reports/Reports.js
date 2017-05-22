import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Menu from '../../layouts/menu/Menu';

class Reports extends React.Component {

  componentWillMount() {
    this.props.getUserReports();
  }

  render() {
    const { reports } = this.props.data || [];
    return (
      <div>
        <Menu />
        <div className="c-dashboard">
          <div className="content-section reports">
            <h4>Report Templates</h4>
            <ul>
              {
                reports.map(report => (
                  <li key={report.id}>
                    <Link to={`/reports/${report.id}`}>{report.attributes.name}</Link>
                  </li>
                ))
              }
            </ul>
          </div>
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
