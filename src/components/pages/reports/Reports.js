import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';

import Filters from './Filters';

const qs = require('querystringify');

class Reports extends React.Component {
  updateFilters = () => {
    this.templateId = this.props.match.params.templateIndex;
    this.searchParams = this.props.location.search && qs.parse(this.props.location.search);
    if (this.searchParams !== undefined){
      this.props.setTemplateSearchParams(this.searchParams);
    }
    if (this.templateId !== undefined) {
      this.props.setSelectedTemplateIndex(this.templateId);
    }
  }

  componentWillMount() {
    this.updateFilters();
  }

  updateAnswers = () => {
    const reportIds = this.props.templates.ids;
    if (reportIds.length === 0) { 
      this.props.getUserTemplates(); 
    } else {
      this.props.getReportAnswers(reportIds[0]);
    }
  }

  componentDidMount() {
    this.updateAnswers();
  }

  componentWillReceiveProps(nextProps){
    if (this.props.templates.ids.length !== nextProps.templates.ids.length){
      this.props.getReportAnswers(nextProps.templates.ids[this.templateId || 0]);
    }
    if (this.props.match.params.templateIndex !== nextProps.match.params.templateIndex){
      this.props.setSelectedTemplateIndex(nextProps.match.params.templateIndex);
    }
    if (this.props.location.search !== nextProps.location.search){
      this.searchParams = nextProps.location.search && qs.parse(nextProps.location.search);
      this.props.setTemplateSearchParams(this.searchParams);
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.templates.ids.length !== nextProps.templates.ids.length || 
           this.props.answers !== nextProps.answers || 
           this.props.match.params.templateIndex !== nextProps.match.params.templateIndex ||
           this.props.location.search !== nextProps.location.search;
  }

  downloadReports = () => {
    const index = this.props.match.params.templateIndex || 0
    this.props.downloadAnswers(this.props.templates.ids[index]);
  }

  render() {
    const { answers, templates } = this.props;
    const columns = [{
      Header: 'Lat/Long',
      accessor: 'latLong'
    },{
      Header: 'Area of interest',
      accessor: 'aoi'
    },{  
      Header: 'Date',
      accessor: 'date'
    },{
      Header: 'Member',
      accessor: 'member'
    }]

    return (
      <div>
        <Hero
          title="Your reports"
          action={{name:'Download Reports', callback: this.downloadReports}}
        />
          <div className="l-content">
            <Article>
              <Filters
                templates={templates} 
                answers={answers}
                templateIndex={this.templateIndex}
                searchParams={this.searchParams}
                history={this.props.history}
                searchDate={this.searchDate}
              />
              <ReactTable
                className="c-table"
                data={answers || []}
                columns={columns}
                showPageSizeOptions={false}
                minRows={5}
              />
            </Article>
          </div>
      </div>
    );
  }
}

Reports.propTypes = {
  answers: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired,
  getReportAnswers: PropTypes.func.isRequired,
  setSelectedTemplateIndex: PropTypes.func.isRequired
};

export default Reports;
