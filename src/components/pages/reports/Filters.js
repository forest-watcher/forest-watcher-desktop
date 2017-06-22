import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import { DEFAULT_LANGUAGE } from '../../../constants/global';

const qs = require('querystringify');

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
    const searchParams = Object.assign(this.props.searchParams, { searchValues: event.target.value }) 
    if (event.target.value === ''){
      delete searchParams.searchValues
    }
    this.redirectWith(searchParams)
  }

  handleAreaChange = (selected) => {
    const searchParams = Object.assign(this.props.searchParams, { aoi: selected.value }) 
    if (selected.value === ''){
      delete searchParams.aoi
    }
    this.redirectWith(searchParams)
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
      <div className="row">
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
            value={this.props.searchParams ? { label: this.props.searchParams.aoi, value: this.props.searchParams.aoi } : null}
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
            name="name"
            placeholder="Search"
          />       
        </div>     
      </div>
    );
  }
}

Filters.propTypes = {
  answers: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired,
  templateIndex: PropTypes.number
};

export default Filters;
