import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import { DEFAULT_LANGUAGE, DEFAULT_FORMAT } from '../../../constants/global';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import qs from 'query-string';

class Filters extends React.Component {
  handleTemplateChange = (selected) => {
    this.props.history.push({
      pathname: `/reports/template/${selected.value}`,
      search: qs.stringify(this.props.searchParams)
    })
  }

  redirectWith(searchParams){
    this.props.history.push({
      pathname: `/reports/template/${this.props.templateId || 0}`,
      search: qs.stringify(searchParams)
    })
  }

  handleSearchChange = (event) => {
    const searchParams = Object.assign(this.props.searchParams, { searchValues: event.target.value });
    if (event.target.value === ''){
      delete searchParams.searchValues
    }
    this.redirectWith(searchParams);
  }

  handleDateChange = (date) => {
    const parsedDate = date && moment(date).format(DEFAULT_FORMAT);
    const searchParams = Object.assign(this.props.searchParams, { date: parsedDate });
    if (!parsedDate){
      delete searchParams.date
    }
    this.redirectWith(searchParams);
  }

  handleAreaChange = (selected) => {
    const searchParams = Object.assign(this.props.searchParams, { aoi: selected.value });
    if (selected.value === ''){
      delete searchParams.aoi
    }
    this.redirectWith(searchParams);
  }
  
  render() {
    const { answers, templates } = this.props;
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
      <div className="row filter-bar">
        <div className="column">
          <Select
            name="template-select"
            value={options[this.props.templateIndex || 0]}
            options={options}
            onChange={this.handleTemplateChange}
            clearable={false}
          />
        </div>
        <div className="column">
          <Select
            name="area-filter"
            value={this.props.searchParams.aoi ? { label: this.props.searchParams.aoi, value: this.props.searchParams.aoi } : null}
            options={areasOptions}
            onChange={this.handleAreaChange}
            resetValue={{value: '', label: ''}}
            placeholder={'Filter by Area'}
          />
        </div>
        <div className="c-search-bar">
          <input
            type="text"
            onChange={this.handleSearchChange}
            value={this.props.searchParams.searchValues || ''}
            name="search-bar"
            placeholder="Search"
          />   
          <DatePicker
            className="datepicker"
            dateFormat={DEFAULT_FORMAT}
            selected={this.props.searchParams.date && moment(this.props.searchParams.date, DEFAULT_FORMAT)}
            onChange={this.handleDateChange}
            isClearable={true}
            placeholderText={"Filter by date"}
          />
        </div>  
      </div>
    );
  }
}

Filters.propTypes = {
  answers: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired,
  templateIndex: PropTypes.string,
  searchParams: PropTypes.object
};

export default Filters;
