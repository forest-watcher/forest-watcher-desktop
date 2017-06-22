import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 
import Select from 'react-select';
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { DEFAULT_LANGUAGE } from '../../../constants/global';

const qs = require('querystringify');

class Reports extends React.Component {
  componentWillMount() {
    this.templateId = this.props.match.params.templateIndex;
    this.searchParams = this.props.location.search && qs.parse(this.props.location.search);
    if (this.searchParams !== undefined){
      this.props.setTemplateSearchParams(this.searchParams);
    }
    if (this.templateId) {
      this.props.setSelectedTemplateIndex(this.templateId);
    }
  }
  componentDidMount() {
    const reportIds = this.props.templates.ids;
    if (reportIds.length === 0) { 
      this.props.getUserTemplates(); 
    } else {
      this.props.getReportAnswers(reportIds[0]);
    }
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

  handleTemplateChange = (selected) => {
    this.props.history.push({
      pathname: `/reports/template/${selected.value}`,
      search: qs.stringify(this.searchParams)
    })
  }

  handleAreaChange = (selected) => {
    const searchParams = Object.assign(this.searchParams, { aoi: selected.value }) 
    if (selected.value === ''){
      delete searchParams.aoi
    }
    this.props.history.push({
      pathname: `/reports/template/${this.templateId || 0}`,
      search: qs.stringify(searchParams)
    })
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
    }
    ]

    let options = []
    let areasOptions = []
    if (templates.data) {
      options = Object.keys(templates.data).map((key, i) => (
        { label: templates.data[key].attributes.name[DEFAULT_LANGUAGE], 
          value: i
        }
      ));
    }
    if (answers.length > 0) {
      areasOptions = answers.map((answer, index) => ({ label:answer.aoi, value: answer.aoi }))
    }
    return (
      <div>
        <Hero
          title="Your reports"
        />
        {(templates.ids.length > 0) ? 
          <div className="l-content">
            <Article>
              <Select
                name="template-select"
                value={options[this.templateIndex || 0]}
                options={options}
                onChange={this.handleTemplateChange}
                clearable={false}
              />
              <Select
                name="area-filter"
                value={this.searchParams ? { label: this.searchParams.aoi, value: this.searchParams.aoi } : null}
                options={areasOptions}
                onChange={this.handleAreaChange}
                resetValue={{value: '', label: ''}}
                placeholder={'Filter by Area'}
              />   
              <ReactTable
                className="c-table"
                data={answers || []}
                columns={columns}
                showPageSizeOptions={false}
                minRows={5}
              />
            </Article>
          </div> : null}
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
