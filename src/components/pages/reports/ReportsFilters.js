import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import { DEFAULT_FORMAT } from '../../../constants/global';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { injectIntl } from 'react-intl';

import 'react-datepicker/dist/react-datepicker.css';

import qs from 'query-string';

class ReportsFilters extends React.Component {
  
  redirectWith(searchParams){
    this.props.history.push({
      pathname: `/reports/${this.props.match.params.templateId}`,
      search: qs.stringify(searchParams)
    })
  }

  handleTemplateChange = (selected) => {
    this.props.history.push({
      pathname: `/reports/${selected.value}`
    })
  }

  handleAreaChange = (selected) => {
    const searchParams = Object.assign(this.props.searchParams, { aoi: selected.value || undefined });
    this.redirectWith(searchParams);
  }

  handleSearchChange = (event) => {
    const searchParams = Object.assign(this.props.searchParams, { searchValues: event.target.value || undefined });
    this.redirectWith(searchParams);
  }

  handleDateChange = (date) => {
    const parsedDate = date && moment(date).format(DEFAULT_FORMAT);
    const searchParams = Object.assign(this.props.searchParams, { date: parsedDate || undefined });
    this.redirectWith(searchParams);
  }

  render() {
    const { templateOptions, areasOptions } = this.props;
    return (
      <div className="row filter-bar">
        <div className="column small-12 medium-3">
          <Select
            name="template-select"
            className="c-select"
            value={this.props.match.params.templateId || 0}
            options={templateOptions}
            onChange={this.handleTemplateChange}
            clearable={false}
            searchable={false}
            placeholder={this.props.intl.formatMessage({ id: 'filters.templates' })}
            noResultsText={this.props.intl.formatMessage({ id: 'filters.noTemplatesAvailable' })}
            arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
          />
        </div>
        <div className="column small-12 medium-3">
          <Select
            className="c-select"
            name="area-filter"
            value={this.props.searchParams.aoi || null}
            options={areasOptions}
            onChange={this.handleAreaChange}
            resetValue={{value: '', label: ''}}
            searchable={false}
            placeholder={this.props.intl.formatMessage({ id: 'filters.area' })}
            noResultsText={this.props.intl.formatMessage({ id: 'filters.noAreasAvailable' })}
            arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
          />
        </div>
        <div className="column small-12 medium-3">
          <input
            type="text"
            className="c-search"
            onChange={this.handleSearchChange}
            value={this.props.searchParams.searchValues || ''}
            name="search-bar"
            placeholder={this.props.intl.formatMessage({ id: 'filters.search' })}
          />   
        </div>  
        <div className="column small-12 medium-3">
          <div className="c-date-picker">
            <DatePicker
              dateFormat={DEFAULT_FORMAT}
              selected={this.props.searchParams.date && moment(this.props.searchParams.date, DEFAULT_FORMAT)}
              onChange={this.handleDateChange}
              isClearable={true}
              placeholderText={this.props.intl.formatMessage({ id: 'filters.date' })}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReportsFilters.propTypes = {
  answers: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired,
  templateId: PropTypes.string,
  searchParams: PropTypes.object
};

export default injectIntl(ReportsFilters);
