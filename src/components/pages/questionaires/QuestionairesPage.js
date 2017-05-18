import React from 'react';
import ReportLink from '../../reports/ReportLink.js';
import DashboardMenu from '../../DashboardMenu.js';

class QuestionairesPage extends React.Component {

  componentWillMount() {
    this.props.getUserReports();
  }

  render() {
    let reports = [];
    for (let i = 0, dLength = this.props.data.reports.length || 0; i < dLength; i++) {
      reports.push(<li key={i}><ReportLink data={this.props.data.reports[i]}/></li>);
    }

    return (
      <div>
        <DashboardMenu />
        <div className="c-dashboard">
          <div className="content-section reports">
            <h4>Report Templates</h4>
            <ul>
              {reports}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionairesPage;
