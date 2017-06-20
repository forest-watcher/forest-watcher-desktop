import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 
import ReactTable from 'react-table'
 
class Reports extends React.Component {

  componentWillMount() {
    const reportIds = this.props.reports.ids;
    
    if(reportIds.length === 0){ this.props.getUserReports(); }
    if(reportIds.length){ reportIds.forEach((id) => this.props.getReportAnswers(id)); } 
  }

  render() {
    const { answers } = this.props;
    const columns = [{
      Header: 'Lat/Long',
      accessor: 'latLong'
    },{
      Header: 'Template',
      accessor: 'template'
    },{
      Header: 'Area of interest',
      accessor: 'aoi'
    },{  
      Header: 'Date',
      accessor: 'date'
    },{
      Header: 'Member',
      accessor: 'member'
    }
    ]
    return (
      <div>
        <Hero
          title="Reports"
        />
        <div className="l-content">
          <Article>
            <ReactTable
              className="c-table" 
              data={answers || []}
              columns={columns}
              showPageSizeOptions={false}
              minRows={5}
              filterable={false}
            />
          </Article>
        </div>  
      </div>
    );
  }
}

Reports.propTypes = {
  answers: PropTypes.array.isRequired
};

export default Reports;
