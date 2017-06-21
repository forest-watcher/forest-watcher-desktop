import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 
import Select from 'react-select';
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { DEFAULT_LANGUAGE } from '../../../constants/global';

class Reports extends React.Component {

  constructor(){
    super();
    this.state = {
      templateIndex: 0
    }
    this.handleTemplateChange = this.handleTemplateChange.bind(this);
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
      this.props.getReportAnswers(nextProps.templates.ids[this.state.templateIndex]);
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.templates.ids.length !== nextProps.templates.ids.length || 
           this.props.answers !== nextProps.answers;
  }

  handleTemplateChange(selected){
    this.props.setSelectedTemplateIndex(selected.value);
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
    if (this.props.templates.data) {
      options = Object.keys(this.props.templates.data).map((key, i) => (
        { label: this.props.templates.data[key].attributes.name[DEFAULT_LANGUAGE], 
          value: i
        }
      ));
    }
    return (
      <div>
        <Hero
          title="Reports"
        />
        {(templates.ids.length > 0) ? 
          <div className="l-content">
            <Article>
              <Select
                name="template-select"
                value={options[this.state.templateIndex]}
                options={options}
                onChange={this.handleTemplateChange}
              />    
              <ReactTable
                className="c-table" 
                data={answers || []}
                columns={columns}
                showPageSizeOptions={false}
                minRows={5}
                filterable={false}
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
