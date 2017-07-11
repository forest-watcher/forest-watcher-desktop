import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import { injectIntl } from 'react-intl';

import qs from 'query-string';

class TemplatesFilters extends React.Component {
  
  redirectWith(searchParams){
    this.props.history.push({
      pathname: `/templates`,
      search: qs.stringify(searchParams)
    });
  }

  handleAreaChange = (selected) => {
    const searchParams = Object.assign(this.props.searchParams, { aoi: selected.value || undefined });
    this.redirectWith(searchParams);
  }

  handleSearchChange = (event) => {
    const searchParams = Object.assign(this.props.searchParams, { searchValues: event.target.value || undefined });
    this.redirectWith(searchParams);
  }

  render() {
    const { areasOptions } = this.props;
    return (
      <div className="row filter-bar">
        <div className="column">
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
        <div className="c-search-bar">
          <input
            type="text"
            onChange={this.handleSearchChange}
            value={this.props.searchParams.searchValues || ''}
            name="search-bar"
            placeholder={this.props.intl.formatMessage({ id: 'filters.search' })}
          />   
        </div>  
      </div>
    );
  }
}

TemplatesFilters.propTypes = {
  searchParams: PropTypes.object
};

export default injectIntl(TemplatesFilters);
