import { Component } from "react";
import PropTypes from "prop-types";

import Select from "react-select";
import { injectIntl } from "react-intl";
import DropdownIndicator from "../../components/ui/SelectDropdownIndicator";

import qs from "query-string";

class TemplatesFilters extends Component {
  redirectWith(searchParams) {
    this.props.history.push({
      pathname: `/templates`,
      search: qs.stringify(searchParams)
    });
  }

  handleAreaChange = selected => {
    let aoi = undefined;
    if (selected) {
      aoi = selected.value || undefined;
    }
    this.redirectWith(Object.assign(this.props.searchParams, { page: 1 }, { aoi }));
  };

  handleSearchChange = event => {
    const searchParams = Object.assign(
      this.props.searchParams,
      { page: 1 },
      { searchValues: event.target.value || undefined }
    );
    this.redirectWith(searchParams);
  };

  render() {
    const { areasOptions } = this.props;
    return (
      <div className="row filter-bar">
        <div className="column small-12 medium-3 medium-offset-6">
          <Select
            className="c-select u-w-100"
            classNamePrefix="Select"
            name="area-filter"
            value={areasOptions.find(option => option.value === this.props.searchParams.aoi)}
            options={areasOptions}
            onChange={this.handleAreaChange}
            resetValue={{ value: "", label: "" }}
            isSearchable={false}
            isClearable={true}
            placeholder={this.props.intl.formatMessage({ id: "filters.area" })}
            noResultsText={this.props.intl.formatMessage({ id: "filters.noAreasAvailable" })}
            components={{ DropdownIndicator }}
          />
        </div>
        <div className="column small-3">
          <input
            className="c-search"
            type="text"
            onChange={this.handleSearchChange}
            value={this.props.searchParams.searchValues || ""}
            name="search-bar"
            placeholder={this.props.intl.formatMessage({ id: "filters.search" })}
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
