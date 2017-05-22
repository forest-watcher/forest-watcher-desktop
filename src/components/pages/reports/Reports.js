import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '../../semantic/menu/Menu.js';

class Reports extends React.Component {

  componentWillMount() {
    this.props.getUserReports();
  }

  render() {
    const { reports  } = this.props.data || [];
    return (
      <div>
        <Menu />
        <div className="c-dashboard">
          <div className="content-section reports">
            <h4>Report Templates</h4>
            <ul>
              {
                reports.map((report, i) => {
                  return (
                    <li key={i}>
                      <Link to={`/reports/${report.id}`}>{report.attributes.name}</Link>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
